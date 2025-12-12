import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { Word } from '../words/words.model';
import { Logger } from '@ielts/utils';
import { AppError } from '../../core/errors/AppError';

const wordSchema = z.object({
  word: z.string().min(1, 'Word is required'),
  meaning: z.string().min(1, 'Meaning is required'),
  exampleSentence: z.string().min(1, 'Example sentence is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  topic: z.string().optional(),
  partOfSpeech: z.string().optional(),
  synonyms: z.string().optional(), // comma-separated
  antonyms: z.string().optional(), // comma-separated
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
            row: i + 2, // +2 for header and 0-index
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

        await Word.create({
          ...validatedData,
          synonyms,
          antonyms,
        });

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
