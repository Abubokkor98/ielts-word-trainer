import { axiosInstance } from '@ielts/auth';
import type { Question, QuizAttempt, QuizRecommendation } from '../types';

export const quizApi = {

  saveAttempt: async (attemptData: QuizAttempt) => {
    const { data } = await axiosInstance.post('/quiz/attempts', attemptData);
    return data;
  },

  getRecommendation: async (): Promise<QuizRecommendation> => {
    const { data } = await axiosInstance.get<{
      data: { recommendation: string; reason: string };
    }>('/quiz/recommend-difficulty');
    return {
      type: data.data.recommendation,
      reason: data.data.reason,
    };
  },
};
