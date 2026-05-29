import { axiosInstance } from '@ielts/auth';
import type { AnalyticsData } from '../types';

interface BackendRecentAttempt {
  id: string;
  score: number;
  totalQuestions: number;
  percentage: string;
  timeSpent: number;
  difficulty: string;
  topic?: string;
  completedAt: string;
}

interface BackendDifficultyStat {
  averageScore: string;
  attempts: number;
}

interface BackendProgressTrend {
  attempt: number;
  score: string;
  date: string;
}

interface BackendAnalyticsResponse {
  totalAttempts: number;
  totalQuizzes: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  averageScore: string;
  bestScore: string;
  worstScore: string;
  averageTimePerQuestion: string;
  performanceByDifficulty: Record<string, BackendDifficultyStat>;
  performanceByTopic: Record<string, { averageScore: string; attempts: number }>;
  recentAttempts: BackendRecentAttempt[];
  progressTrend: BackendProgressTrend[];
}

export const analyticsApi = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const { data } = await axiosInstance.get<{ data: BackendAnalyticsResponse }>('/quiz/analytics/me');
    const response = data.data;

    return {
      totalQuizzes: response.totalQuizzes,
      averageScore: parseFloat(response.averageScore),
      bestScore: parseFloat(response.bestScore),
      totalQuestionsAnswered: response.totalQuestionsAnswered,
      correctAnswers: response.correctAnswers,
      performanceOverTime: (() => {
        const trendData = response.progressTrend || [];
        
        const groupedByDate = trendData.reduce((acc, t) => {
          const dateStr = new Date(t.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          
          if (!acc[dateStr]) {
            acc[dateStr] = { sum: 0, count: 0 };
          }
          acc[dateStr].sum += parseFloat(t.score);
          acc[dateStr].count += 1;
          
          return acc;
        }, {} as Record<string, { sum: number; count: number }>);

        return Object.entries(groupedByDate).map(([date, stats]) => ({
          date,
          score: parseFloat((stats.sum / stats.count).toFixed(1)),
        }));
      })(),
      accuracyByDifficulty: Object.entries(response.performanceByDifficulty || {}).map(
        ([difficulty, stats]) => ({
          difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
          accuracy: parseFloat(stats.averageScore),
        })
      ),
      recentAttempts: (response.recentAttempts || []).map((attempt) => ({
        _id: attempt.id,
        completedAt: attempt.completedAt,
        difficulty: attempt.difficulty,
        score: attempt.score,
      })),
    };
  },
};

