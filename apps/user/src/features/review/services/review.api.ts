import { axiosInstance } from '@ielts/auth';
import type { QualityRating, ReviewWord } from '../types';

export const reviewApi = {
  getDueWords: async (options?: {
    limit?: number;
    topicId?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  }): Promise<ReviewWord[]> => {
    const { data } = await axiosInstance.get<{
      success: boolean;
      data: ReviewWord[];
    }>('/srs/due', { params: options });
    return data.success ? data.data : [];
  },

  submitReview: async (wordId: string, quality: QualityRating): Promise<void> => {
    await axiosInstance.post('/srs/review', { wordId, quality });
  },
};
