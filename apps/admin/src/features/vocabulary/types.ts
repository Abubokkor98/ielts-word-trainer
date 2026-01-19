// Re-export shared types
export interface Word {
  _id: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: ('reading' | 'writing' | 'listening' | 'speaking')[];
  partOfSpeech: string;
  topics: Array<{ _id: string; name: string }>;
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
