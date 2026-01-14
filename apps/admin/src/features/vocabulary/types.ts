// Re-export shared types
export type { DifficultyLevel } from '../../../types';

export interface Word {
  _id: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  module: string;
  partOfSpeech: string;
  topic: any;
  synonyms: string[];
  antonyms: string[];
}

export interface WordsQueryParams {
  page: number;
  limit: number;
  search?: string;
  difficulty?: 'all' | 'beginner' | 'intermediate' | 'advanced';
}

export interface WordsResponse {
  words: Word[];
  totalPages: number;
  currentPage: number;
  total: number;
}
