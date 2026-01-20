import { z } from 'zod';
import { Difficulty, ModuleType, UserRole } from './enums';

// User Schemas
export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Word Schemas
export const CreateWordSchema = z.object({
  word: z.string().min(1),
  meaning: z.string().min(1),
  exampleSentence: z.string(),
  partOfSpeech: z.string().min(1),
  synonyms: z.array(z.string()),
  antonyms: z.array(z.string()),
  topics: z.array(z.string()).min(1, 'At least one topic is required'),
  modules: z.array(z.nativeEnum(ModuleType)).min(1, 'At least one module is required'),
  difficulty: z.nativeEnum(Difficulty),
});

// Types from Schemas
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateWordInput = z.infer<typeof CreateWordSchema>;
