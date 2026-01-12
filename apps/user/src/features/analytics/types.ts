export interface PerformanceTrend {
  date: string;
  score: number;
}

export interface DifficultyAccuracy {
  difficulty: string;
  accuracy: number;
}

export interface RecentAttempt {
  _id: string;
  completedAt: string;
  difficulty: string;
  score: number;
}

export interface AnalyticsData {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  performanceOverTime: PerformanceTrend[];
  accuracyByDifficulty: DifficultyAccuracy[];
  recentAttempts: RecentAttempt[];
}
