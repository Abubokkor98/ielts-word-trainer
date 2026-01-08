import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { Word } from '../words/words.model';
import { Topic } from '../topics/topics.model';
import { Logger } from '@ielts/utils';
import { AppError } from '../../core/errors/AppError';

const wordSchema = z.object({
  word: z.string().min(1, 'Word is required'),
  meaning: z.string().min(1, 'Meaning is required'),
  exampleSentence: z.string().min(1, 'Example sentence is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  topic: z.string().min(1, 'Topic is required'),
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
      });

      if (records.length === 0) {
        throw new AppError('CSV file is empty', 400);
      }

      const requiredColumns = [
        'word',
        'meaning',
        'exampleSentence',
        'difficulty',
        'topic',
        'partOfSpeech',
        'synonyms',
        'antonyms',
      ];
      const firstRecord = records[0] as Record<string, unknown>;
      const missingColumns = requiredColumns.filter(
        (col) => !(col in firstRecord)
      );

      if (missingColumns.length > 0) {
        throw new AppError(
          `Missing required columns: ${missingColumns.join(', ')}`,
          400
        );
      }

      return records;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Invalid CSV format: ${error.message}`, 400);
    }
  }

  static async importWords(csvContent: string) {
    const records = this.validateCSVStructure(csvContent);

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

        // Resolve Topic (Find or Create)
        let topicId;
        const topicName = validatedData.topic;
        let topic = await Topic.findOne({
          name: new RegExp(`^${topicName}$`, 'i'),
        });

        if (!topic) {
          topic = await Topic.create({
            name: topicName,
            wordCount: 0, // Will be incremented properly elsewhere? Or we should increment it here?
            // For now, simplicity: create it.
          });
        }
        topicId = topic._id;

        await Word.create({
          ...validatedData,
          topic: topicId,
          synonyms,
          antonyms,
        });

        // Update topic word count
        await Topic.findByIdAndUpdate(topicId, { $inc: { wordCount: 1 } });

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

  static generateTemplate() {
    return `word,meaning,exampleSentence,difficulty,topic,partOfSpeech,synonyms,antonyms
abundant,existing in large quantities,The garden had abundant flowers.,intermediate,vocabulary,adjective,"plentiful,ample","scarce,sparse"
elaborate,involving many careful details,She gave an elaborate explanation.,advanced,vocabulary,adjective,"detailed,complex","simple,basic"`;
  }
}
