import { axiosInstance } from '@ielts/auth';
import type { Question, QuizAttempt, QuizRecommendation } from '../types';

export const quizApi = {
  generateQuiz: async (difficulty: string = 'mixed', limit: number = 10): Promise<Question[]> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (difficulty && difficulty !== 'mixed') {
      params.append('difficulty', difficulty);
    }
    const { data } = await axiosInstance.get<{ data: Question[] }>(`/quiz/generate?${params}`);
    return data.data;
  },

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
