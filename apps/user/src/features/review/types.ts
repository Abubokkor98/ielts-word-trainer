import type { ModuleType } from '@ielts/shared';

export interface ReviewWord {
  _id: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: Array<{
    _id: string;
    name: string;
  }>;
  modules: ModuleType[];
}

export interface ReviewSession {
  words: ReviewWord[];
  currentIndex: number;
  reviewedCount: number;
  isComplete: boolean;
}

export type QualityRating = 0 | 3 | 4 | 5; // SM-2 algorithm ratings
