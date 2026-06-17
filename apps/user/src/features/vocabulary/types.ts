import type { DifficultyLevel } from '../../types';

export interface Word {
  id: string;
  _id?: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  difficulty: DifficultyLevel;
  //will update topic type in future
  topics: Array<{
    id?: string;
    _id?: string;
    name: string;
    slug: string;
    wordCount?: number;
  }>;
  partOfSpeech: string;
  modules: ('reading' | 'writing' | 'listening' | 'speaking')[];
  synonyms: string[];
  antonyms: string[];
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
  module?: 'reading' | 'writing' | 'listening' | 'speaking';
}
