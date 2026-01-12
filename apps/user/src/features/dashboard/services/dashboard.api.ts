import { axiosInstance } from '@ielts/auth';
import type { QuizAnalytics, SRSStats, UserProfile } from '../types';

export const dashboardApi = {
  getUser: async (): Promise<UserProfile> => {
    const { data } = await axiosInstance.get<{ data: UserProfile }>('/auth/me');
    return data.data;
  },

  getAnalytics: async (): Promise<QuizAnalytics> => {
    const { data } = await axiosInstance.get<{ data: QuizAnalytics }>('/quiz/analytics/me');
    return data.data;
  },

  getSRSStats: async (): Promise<SRSStats> => {
    const { data } = await axiosInstance.get<{ data: SRSStats }>('/srs/stats');
    return data.data;
  },
};
