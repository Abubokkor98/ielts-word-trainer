import { z } from 'zod';
import { validateRequest } from '../../core/middleware/validate.middleware';

export const createWordSchema = z.object({
  word: z.string().min(1, 'Word is required'),
  meaning: z.string().min(1, 'Meaning is required'),
  exampleSentence: z.string().min(1, 'Example sentence is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  partOfSpeech: z.string().optional(),
  pronunciation: z.string().optional(),
  topic: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  antonyms: z.array(z.string()).optional(),
});

export const validateWordInput = validateRequest({
  body: createWordSchema,
});
