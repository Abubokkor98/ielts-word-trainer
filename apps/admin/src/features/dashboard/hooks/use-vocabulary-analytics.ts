import { useQuery } from '@tanstack/react-query';
import {
  type TopWord,
  type UnusedWord,
  type UsageStats,
  type VocabularyOverview,
  vocabularyAnalyticsApi,
} from '../services/vocabulary-analytics.api';

/**
 * Hook to fetch vocabulary overview metrics
 */
export const useVocabularyOverview = () => {
  return useQuery<VocabularyOverview>({
    queryKey: ['admin', 'vocabulary', 'overview'],
    queryFn: () => vocabularyAnalyticsApi.getOverview(),
    // Refresh every 5 minutes
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch top performing words
 */
export const useTopWords = (limit = 20) => {
  return useQuery<{ words: TopWord[]; count: number }>({
    queryKey: ['admin', 'vocabulary', 'top-words', limit],
    queryFn: () => vocabularyAnalyticsApi.getTopWords(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch unused words
 */
export const useUnusedWords = (limit = 50) => {
  return useQuery<{ words: UnusedWord[]; count: number }>({
    queryKey: ['admin', 'vocabulary', 'unused-words', limit],
    queryFn: () => vocabularyAnalyticsApi.getUnusedWords(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch word usage statistics
 */
export const useUsageStats = (limit = 20) => {
  return useQuery<UsageStats>({
    queryKey: ['admin', 'vocabulary', 'usage-stats', limit],
    queryFn: () => vocabularyAnalyticsApi.getUsageStats(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
