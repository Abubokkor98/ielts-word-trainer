export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  xp: number;
  streak: number;
  lastQuizDate?: string;
  role?: string;
}

export interface QuizAnalytics {
  totalQuizzes: number;
  averageScore: number;
  totalCorrectAnswers?: number;
  totalQuestions?: number;
}

export interface SRSStats {
  dueToday: number;
  learning: number;
  reviewing: number;
  mastered: number;
  totalWords: number;
}

export interface DashboardData {
  user: UserProfile | null;
  analytics: QuizAnalytics | null;
  srsStats: SRSStats | null;
}
