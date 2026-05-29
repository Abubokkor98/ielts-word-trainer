'use client';

import { AnalyticsEmptyState } from './components/analytics-empty-state';
import { AnalyticsSkeleton } from './components/analytics-skeleton';
import { AnalyticsStatCard } from './components/analytics-stat-card';
import { DifficultyChart } from './components/difficulty-chart';
import { PerformanceChart } from './components/performance-chart';
import { RecentAttemptsTable } from './components/recent-attempts-table';
import { useAnalytics } from './hooks/use-analytics';

export function AnalyticsContainer() {
  const { data: analytics, isLoading } = useAnalytics();

  const overallAccuracy =
    analytics && analytics.totalQuestionsAnswered > 0
      ? Math.round((analytics.correctAnswers / analytics.totalQuestionsAnswered) * 100)
      : 0;

  return (
    <main className="bg-background py-8 w-full min-h-[80vh]">
      <div className="container mx-auto px-6 max-w-[1324px]">
        {isLoading ? (
          <AnalyticsSkeleton />
        ) : !analytics || analytics.totalQuizzes === 0 ? (
          <AnalyticsEmptyState />
        ) : (
          <div className="flex flex-col gap-8">
            <header>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Quiz Analytics
              </h1>
              <p className="text-base text-muted-foreground">
                Track your performance
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <AnalyticsStatCard
                label="TOTAL QUIZZES"
                value={analytics.totalQuizzes}
              />
              <AnalyticsStatCard
                label="AVG SCORE"
                value={`${analytics.averageScore}%`}
              />
              <AnalyticsStatCard
                label="BEST SCORE"
                value={`${analytics.bestScore}%`}
              />
              <AnalyticsStatCard
                label="ACCURACY"
                value={`${overallAccuracy}%`}
              />
            </div>

            <PerformanceChart data={analytics.performanceOverTime} />

            <DifficultyChart data={analytics.accuracyByDifficulty} />

            <RecentAttemptsTable attempts={analytics.recentAttempts} />
          </div>
        )}
      </div>
    </main>
  );
}
