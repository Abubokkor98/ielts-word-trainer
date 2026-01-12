import { axiosInstance } from '@ielts/auth';
import type { AnalyticsData } from '../types';

export const analyticsApi = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const { data } = await axiosInstance.get<{ data: AnalyticsData }>('/quiz/analytics/me');
    return data.data;
  },
};
