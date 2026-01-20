import { axiosInstance } from '@ielts/auth';
import type {
  DashboardMetrics,
  DashboardMetricsResponse,
  ProblemWord,
  ProblemWordsResponse,
} from '../types';

export const dashboardApi = {
  /**
   * Fetch dashboard metrics for the given time range
   */
  getMetrics: async (timeRange: '7d' | '30d' = '7d'): Promise<DashboardMetrics> => {
    const { data } = await axiosInstance.get<DashboardMetricsResponse>('/admin/dashboard-metrics', {
      params: { timeRange },
    });
    if (!data.success) {
      throw new Error('Failed to fetch dashboard metrics');
    }
    return data.data;
  },

  /**
   * Fetch problem words with optional limit
   */
  getProblemWords: async (limit?: number): Promise<{ words: ProblemWord[]; count: number }> => {
    const { data } = await axiosInstance.get<ProblemWordsResponse>('/admin/problem-words', {
      params: { limit },
    });
    if (!data.success) {
      throw new Error('Failed to fetch problem words');
    }
    return data.data;
  },
};
