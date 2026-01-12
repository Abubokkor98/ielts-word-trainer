import { axiosInstance } from '@ielts/auth';
import type { QualityRating, ReviewWord } from '../types';

export const reviewApi = {
  getDueWords: async (): Promise<ReviewWord[]> => {
    const { data } = await axiosInstance.get<{
      success: boolean;
      data: ReviewWord[];
    }>('/srs/due');
    return data.success ? data.data : [];
  },

  submitReview: async (wordId: string, quality: QualityRating): Promise<void> => {
    await axiosInstance.post('/srs/review', { wordId, quality });
  },
};
