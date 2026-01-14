import { axiosInstance } from '@ielts/auth';
import { useQuery } from '@tanstack/react-query';
import type {
  DashboardMetrics,
  DashboardMetricsResponse,
  ProblemWord,
  ProblemWordsResponse,
} from '../types/dashboard';

export const useDashboardMetrics = (timeRange: '7d' | '30d' = '7d') => {
  return useQuery({
    queryKey: ['admin', 'dashboard-metrics', timeRange],
    queryFn: async () => {
      const { data } = await axiosInstance.get<DashboardMetricsResponse>(
        '/admin/dashboard-metrics',
        {
          params: { timeRange },
        }
      );
      return data.data;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useProblemWords = (limit?: number) => {
  return useQuery({
    queryKey: ['admin', 'problem-words', limit],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ProblemWordsResponse>(
        '/admin/problem-words',
        { params: { limit } }
      );
      return data.data;
    },
    // Don't auto-refresh this too often as it's heavy aggregation
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
