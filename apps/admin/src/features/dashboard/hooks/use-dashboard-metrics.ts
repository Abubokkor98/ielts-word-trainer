import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboard.api';
import type { DashboardMetrics, ProblemWord } from '../types';

export const useDashboardMetrics = (timeRange: '7d' | '30d' = '7d') => {
  return useQuery<DashboardMetrics>({
    queryKey: ['admin', 'dashboard-metrics', timeRange],
    queryFn: () => dashboardApi.getMetrics(timeRange),
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useProblemWords = (limit?: number) => {
  return useQuery<{ words: ProblemWord[]; count: number }>({
    queryKey: ['admin', 'problem-words', limit],
    queryFn: () => dashboardApi.getProblemWords(limit),
    // Don't auto-refresh this too often as it's heavy aggregation
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
