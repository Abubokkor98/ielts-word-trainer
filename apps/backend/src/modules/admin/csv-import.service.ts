import { parse } from 'csv-parse/sync';
import mongoose from 'mongoose';
import { z } from 'zod';
import { AppError } from '../../core/errors/AppError';
import { Logger } from '../../utils';
import { Topic } from '../topics/topics.model';
import { Word } from '../words/words.model';
import { resolveTopic, resolveTopics } from '../words/words.service';

const wordSchema = z.object({
  word: z.string().min(1, 'Word is required'),
  meaning: z.string().min(1, 'Meaning is required'),
  exampleSentence: z.string().min(1, 'Example sentence is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  modules: z.string().min(1, 'Modules are required'), // comma-separated
  topics: z.string().min(1, 'Topics are required'), // comma-separated
  partOfSpeech: z.string().min(1, 'Part of speech is required'),
  synonyms: z.string().min(1, 'Synonyms are required'), // comma-separated
  antonyms: z.string().min(1, 'Antonyms are required'), // comma-separated
});

export class CSVImportService {
  static validateCSVStructure(content: string) {
    try {
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
      });

      if (records.length === 0) {
        throw new AppError('CSV file is empty', 400);
      }

      const requiredColumns = [
        'word',
        'meaning',
        'exampleSentence',
        'difficulty',
        'modules',
        'topics',
        'partOfSpeech',
        'synonyms',
        'antonyms',
      ];
      const firstRecord = records[0] as Record<string, unknown>;
      const missingColumns = requiredColumns.filter((col) => !(col in firstRecord));

      if (missingColumns.length > 0) {
        throw new AppError(`Missing required columns: ${missingColumns.join(', ')}`, 400);
      }

      return records;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Invalid CSV format: ${error.message}`, 400);
    }
  }

  static async importWords(csvContent: string) {
    const records = CSVImportService.validateCSVStructure(csvContent);

    const results = {
      total: records.length,
      successful: 0,
      failed: 0,
      errors: [] as Array<{ row: number; error: string }>,
    };

    for (let i = 0; i < records.length; i++) {
      try {
        const record = records[i];

        // Validate row data
        const validatedData = wordSchema.parse(record);

        // Check for duplicates
        const existing = await Word.findOne({ word: validatedData.word });
        if (existing) {
          results.errors.push({
            row: i + 2,
            error: `Word "${validatedData.word}" already exists`,
          });
          results.failed++;
          continue;
        }

        // Parse comma-separated fields
        const synonyms = validatedData.synonyms
          ?.split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        const antonyms = validatedData.antonyms
          ?.split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        // Parse comma-separated or space-separated modules
        const validModules = ['reading', 'writing', 'listening', 'speaking'];
        const modules = validatedData.modules
          .split(/[,\s]+/) // Split by comma OR space
          .map((m) => m.trim())
          .filter(Boolean) // Remove empty strings
          .filter((m) => {
            if (!validModules.includes(m.toLowerCase())) {
              throw new Error(`Invalid module: ${m}. Must be one of: ${validModules.join(', ')}`);
            }
            return true;
          })
          .map((m) => m.toLowerCase());

        // Parse comma-separated topics (preserve multi-word topics)
        const topicNames = validatedData.topics
          .split(',') // Only split on comma to preserve spaces in topic names
          .map((t) => t.trim())
          .filter(Boolean);

        // Resolve Topics (Find or Create)
        const topicIds = await resolveTopics(topicNames);

        const { topics: _rawTopics, modules: _rawModules, ...wordData } = validatedData;

        await Word.create({
          ...wordData,
          topics: topicIds,
          modules: modules,
          synonyms,
          antonyms,
        });

        // Update topic word counts
        for (const topicId of topicIds) {
          await Topic.findByIdAndUpdate(topicId, { $inc: { wordCount: 1 } });
        }

        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          row: i + 2,
          error: error.message || 'Validation failed',
        });
        Logger.error(`CSV import row ${i + 2} failed: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Atomic import: All words succeed or all fail (using MongoDB transactions)
   */
  static async importWordsAtomic(csvContent: string) {
    const records = CSVImportService.validateCSVStructure(csvContent);

    // 1. Prepare Data Phase (In-Memory, Outside Transaction)
    // ----------------------------------------------------------------

    // a) Resolve Topics first
    const allTopicNames = new Set<string>();
    for (const record of records as any[]) {
      if (record.topics) {
        record.topics.split(',').forEach((t: string) => {
          allTopicNames.add(t.trim());
        });
      }
    }
    const topicMap = new Map<string, string>();
    for (const name of allTopicNames) {
      if (name) {
        const topicId = await resolveTopic(name);
        topicMap.set(name, topicId);
      }
    }

    // b) Validate and Prep Documents
    const preparedDocs: any[] = [];
    const topicIncrements = new Map<string, number>();
    const wordList: string[] = [];

    const validModules = ['reading', 'writing', 'listening', 'speaking'];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      // Validate with Zod
      let validatedData: z.infer<typeof wordSchema>;
      try {
        validatedData = wordSchema.parse(record);
      } catch (error: any) {
        throw new AppError(`Validation error at row ${i + 2}: ${error.message}`, 400);
      }

      wordList.push(validatedData.word);

      // Modules
      const modules = validatedData.modules
        .split(/[,\s]+/)
        .map((m) => m.trim().toLowerCase())
        .filter((m) => {
          if (!validModules.includes(m)) {
            throw new AppError(`Invalid module: ${m} at row ${i + 2}`, 400);
          }
          return true;
        });

      // Topics
      const topicNames = validatedData.topics
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const topicIds = topicNames.map((name) => topicMap.get(name)!);

      // Topic Counts
      topicIds.forEach((tid) => {
        const sid = tid.toString();
        topicIncrements.set(sid, (topicIncrements.get(sid) || 0) + 1);
      });

      // Syn/Ant
      const synonyms = validatedData.synonyms
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const antonyms = validatedData.antonyms
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const { topics: _, modules: __, ...rest } = validatedData;

      const searchableText = [validatedData.word, ...(synonyms || []), ...(antonyms || [])]
        .join(' ')
        .toLowerCase();

      preparedDocs.push({
        ...rest,
        modules,
        topics: topicIds,
        synonyms,
        antonyms,
        searchableText,
      });
    }

    // 2. Transaction Phase (Only DB Writes)
    // ----------------------------------------------------------------
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // Check duplicates
        const existing = await Word.find({
          word: { $in: wordList },
        }).session(session);
        if (existing.length > 0) {
          const existingWords = existing
            .map((w) => w.word)
            .slice(0, 5)
            .join(', ');
          throw new AppError(
            `Words already exist: ${existingWords}${existing.length > 5 ? '...' : ''}`,
            400,
          );
        }

        // Bulk Insert
        await Word.insertMany(preparedDocs, { session });

        // Bulk Topic Update (Optimized to single DB call)
        const bulkOps = Array.from(topicIncrements.entries()).map(([topicId, count]) => ({
          updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(topicId) },
            update: { $inc: { wordCount: count } },
          },
        }));

        if (bulkOps.length > 0) {
          await Topic.bulkWrite(bulkOps as any[], { session });
        }
      });

      await session.endSession();

      // Return success result
      return {
        total: records.length,
        successful: records.length,
        failed: 0,
        errors: [] as Array<{ row: number; error: string }>,
      };
    } catch (error: any) {
      await session.endSession();
      if (error instanceof AppError) throw error;
      throw new AppError(`Atomic import failed: ${error.message}. No words were imported.`, 400);
    }
  }

  static generateTemplate() {
    return `word,meaning,exampleSentence,difficulty,modules,topics,partOfSpeech,synonyms,antonyms
abundant,existing in large quantities,The garden had abundant flowers.,intermediate,"reading,writing",vocabulary,adjective,"plentiful,ample","scarce,sparse"
elaborate,involving many careful details,She gave an elaborate explanation.,advanced,"writing,speaking",vocabulary,adjective,"detailed,complex","simple,basic"`;
  }
}
