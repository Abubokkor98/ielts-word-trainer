export enum AlertSeverity {
  CRITICAL = 'critical',
  WARNING = 'warning',
  INFO = 'info',
}

export enum AlertAction {
  CHECK_QUIZ_UX = 'check_quiz_ux',
  REVIEW_ACQUISITION = 'review_acquisition',
  REVIEW_RETENTION = 'review_retention',
  REVIEW_CONTENT = 'review_content',
}

export interface MetricWithChange {
  current: number;
  previous: number;
  percentChange: number;
}

export interface DailyActiveUser {
  date: string; // ISO date string (YYYY-MM-DD)
  count: number;
}

export interface DashboardAlert {
  severity: AlertSeverity;
  message: string;
  action: AlertAction;
}

export interface DashboardMetrics {
  activeUsers: MetricWithChange;
  activeLearners: MetricWithChange;
  newUsers: MetricWithChange;
  quizCompletionRate: MetricWithChange;
  avgQuizScore: MetricWithChange;
  dailyActiveUsers: DailyActiveUser[];
  alerts: DashboardAlert[];
}

export interface ProblemWord {
  wordId: string;
  word: string;
  meaning: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  accuracy: number;
  attempts: number;
  lastUpdated?: Date;
}

export interface DashboardMetricsResponse {
  success: boolean;
  data: DashboardMetrics;
}

export interface ProblemWordsResponse {
  success: boolean;
  data: {
    words: ProblemWord[];
    count: number;
  };
}
