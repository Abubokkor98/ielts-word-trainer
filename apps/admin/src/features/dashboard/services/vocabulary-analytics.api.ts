import { axiosInstance } from '@ielts/auth';

// ===========================
// Types
// ===========================

export interface ModuleDistribution {
  reading: number;
  writing: number;
  listening: number;
  speaking: number;
}

export interface DifficultyDistribution {
  beginner: number;
  intermediate: number;
  advanced: number;
}

export interface TopicDistribution {
  topicId: string;
  topicName: string;
  count: number;
}

export interface VocabularyOverview {
  totalCount: number;
  byModule: ModuleDistribution;
  byDifficulty: DifficultyDistribution;
  byTopic: TopicDistribution[];
  avgAccuracy: number;
  unusedWordsCount: number;
}

export interface TopWord {
  wordId: string;
  word: string;
  meaning: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  accuracy: number;
  attempts: number;
  lastUpdated?: string;
}

export interface UnusedWord {
  wordId: string;
  word: string;
  meaning: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: ('reading' | 'writing' | 'listening' | 'speaking')[];
  topics: { id: string; name: string }[];
}

export interface WordUsage {
  wordId: string;
  word: string;
  meaning: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  attemptCount: number;
}

export interface UsageStats {
  mostReviewed: WordUsage[];
  leastReviewed: WordUsage[];
}

// ===========================
// API Response Types
// ===========================

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface WordListResponse<T> {
  words: T[];
  count: number;
}

// ===========================
// API Service
// ===========================

export const vocabularyAnalyticsApi = {
  /**
   * Get vocabulary overview metrics
   */
  getOverview: async (): Promise<VocabularyOverview> => {
    const { data } = await axiosInstance.get<ApiResponse<VocabularyOverview>>(
      '/admin/vocabulary/overview',
    );
    if (!data.success) {
      throw new Error('Failed to fetch vocabulary overview');
    }
    return data.data;
  },

  /**
   * Get top performing words (>= 80% accuracy)
   */
  getTopWords: async (limit = 20): Promise<{ words: TopWord[]; count: number }> => {
    const { data } = await axiosInstance.get<ApiResponse<WordListResponse<TopWord>>>(
      '/admin/vocabulary/top-words',
      { params: { limit } },
    );
    if (!data.success) {
      throw new Error('Failed to fetch top words');
    }
    return data.data;
  },

  /**
   * Get words with no quiz attempts
   */
  getUnusedWords: async (limit = 50): Promise<{ words: UnusedWord[]; count: number }> => {
    const { data } = await axiosInstance.get<ApiResponse<WordListResponse<UnusedWord>>>(
      '/admin/vocabulary/unused-words',
      { params: { limit } },
    );
    if (!data.success) {
      throw new Error('Failed to fetch unused words');
    }
    return data.data;
  },

  /**
   * Get word usage statistics (most and least reviewed)
   */
  getUsageStats: async (limit = 20): Promise<UsageStats> => {
    const { data } = await axiosInstance.get<ApiResponse<UsageStats>>(
      '/admin/vocabulary/usage-stats',
      { params: { limit } },
    );
    if (!data.success) {
      throw new Error('Failed to fetch usage stats');
    }
    return data.data;
  },
};
