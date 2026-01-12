import { DifficultyLevel } from '../../types';

export interface Word {
  _id: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  difficulty: DifficultyLevel;
  topic?: string;
  pronunciation?: string; // Assuming this might exist or be added
  synonyms?: string[];
  antonyms?: string[];
}

export interface VocabularyResponse {
  words: Word[];
  totalPages: number;
  totalWords?: number;
  currentPage?: number;
}

export interface VocabularyFilters {
  page: number;
  limit?: number;
  difficulty: DifficultyLevel | 'all';
  search?: string;
  topic?: string;
}
