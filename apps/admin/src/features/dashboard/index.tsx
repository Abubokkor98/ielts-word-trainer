'use client';

import { selectIsAuthenticated, useAuthStore } from '@ielts/auth';
import { Activity, BookOpen, TrendingUp, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AlertSection } from './components/AlertSection';
import { DashboardSection } from './components/DashboardSection';
import { DAUTrendChart } from './components/DAUTrendChart';
import { DashboardSkeleton } from './components/dashboard-skeleton';
import { DifficultyDistributionChart } from './components/DifficultyDistributionChart';
import { MetricCard } from './components/MetricCard';
import { ModuleDistributionChart } from './components/ModuleDistributionChart';
import { ProblemWordsCard } from './components/ProblemWordsCard';
import { QuickActions } from './components/QuickActions';
import { StatsGrid } from './components/StatsGrid';
import { TopicDistributionChart } from './components/TopicDistributionChart';
import { TopWordsCard } from './components/TopWordsCard';
import { UnusedWordsCard } from './components/UnusedWordsCard';
import { VocabularyOverviewCard } from './components/VocabularyOverviewCard';
import { useDashboardMetrics } from './hooks/use-dashboard-metrics';

export function DashboardContainer() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  // Redirect to login if not authenticated (but wait for hydration first)
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  const { data: metrics, isLoading, isError } = useDashboardMetrics('7d');

  // Show skeleton during hydration
  if (!hasHydrated) {
    return <DashboardSkeleton />;
  }

  // Early return AFTER hydration check
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !metrics) {
    return (
      <div className="p-4 bg-background/50 rounded-2xl border border-destructive/20 text-center">
        <h2 className="text-lg font-bold text-destructive mb-2">
          Error loading dashboard data.
        </h2>
        <button
          type="button"
          className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-colors shadow-lg shadow-primary/10"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const currentDateTime = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="py-6 px-8 max-w-[1920px] mx-auto space-y-8">
      {/* Welcome & North Star Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back. Here is the operational health of the platform.
          </p>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-accent border border-border text-muted-foreground shadow-sm">
            Operational Date: {currentDateTime}
          </span>
        </div>
      </header>

      {/* Platform Health KPIs */}
      <DashboardSection
        title="Platform Health"
        subtitle="Key tracking metrics for the last 7 days"
      >
        <StatsGrid>
          <MetricCard
            label="Active Users"
            sublabel="vs last week"
            value={metrics.activeUsers.current}
            change={metrics.activeUsers.percentChange}
            icon={Users}
          />
          <MetricCard
            label="Active Learners"
            sublabel="vs last week"
            value={metrics.activeLearners.current}
            change={metrics.activeLearners.percentChange}
            icon={BookOpen}
          />
          <MetricCard
            label="New Users"
            sublabel="vs last week"
            value={metrics.newUsers.current}
            change={metrics.newUsers.percentChange}
            icon={TrendingUp}
          />
          <MetricCard
            label="Completion Rate"
            sublabel="vs last week"
            value={`${metrics.quizCompletionRate.current.toFixed(0)}%`}
            change={metrics.quizCompletionRate.percentChange}
            icon={Activity}
          />
          <MetricCard
            label="Avg Score"
            sublabel="vs last week"
            value={`${metrics.avgQuizScore.current.toFixed(0)}%`}
            change={metrics.avgQuizScore.percentChange}
            icon={BookOpen}
          />
        </StatsGrid>
      </DashboardSection>

      {/* Row 2: Action & Attention Center */}
      <DashboardSection
        title="Action & Attention Center"
        subtitle="Immediate operational tasks and exports"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlertSection alerts={metrics.alerts} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </DashboardSection>

      {/* Row 3: Trends & Overview */}
      <DashboardSection
        title="Trends & Overview"
        subtitle="User activity and overall vocabulary health"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DAUTrendChart data={metrics.dailyActiveUsers} />
          </div>
          <div>
            <VocabularyOverviewCard />
          </div>
        </div>
      </DashboardSection>

      {/* Row 4: Vocabulary Distributions */}
      <DashboardSection
        title="Vocabulary Distributions"
        subtitle="Words segmented by modules, learning difficulties, and top topics"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleDistributionChart />
          <DifficultyDistributionChart />
          <TopicDistributionChart />
        </div>
      </DashboardSection>

      {/* Row 5: Actionable Data Lists */}
      <DashboardSection
        title="Content Insights"
        subtitle="Vocabulary performance metrics and tables"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TopWordsCard />
          <UnusedWordsCard />
          <ProblemWordsCard />
        </div>
      </DashboardSection>
    </div>
  );
}
