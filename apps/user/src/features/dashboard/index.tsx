'use client';

import { selectIsAuthenticated, useAuthStore } from '@ielts/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ReviewCard } from '../../components/ReviewCard';
import { DashboardSkeleton } from './components/dashboard-skeleton';
import { DashboardStats } from './components/dashboard-stats';
import { QuickActions } from './components/quick-actions';
import { useDashboardData } from './hooks/use-dashboard-data';

export function DashboardContainer() {
  const localUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  // Redirect to login if not authenticated (but wait for hydration first)
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  const { user, analytics, srsStats, isLoading } = useDashboardData(isAuthenticated, localUser);

  // Show loading during hydration or data fetching within the base layout wrapper
  const isPageLoading = !hasHydrated || isLoading;

  // Early return if not authenticated to prevent flash of content
  if (hasHydrated && !isAuthenticated) {
    return null;
  }

  const currentUser = user || localUser;
  const xp = currentUser?.xp || 0;
  const streak = currentUser?.streak || 0;
  const quizzesTaken = analytics?.totalQuizzes || 0;
  const avgScore = analytics?.averageScore || 0;

  return (
    <main className="bg-background py-8 w-full min-h-[80vh]">
      <div className="container mx-auto px-6 max-w-[1324px]">
        {isPageLoading ? (
          <DashboardSkeleton />
        ) : (
          <div className="flex flex-col gap-8">
            <header>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Welcome back, {currentUser?.name}! 👋
              </h1>
              <p className="text-base text-muted-foreground">
                Ready to continue your IELTS journey?
              </p>
            </header>

            <DashboardStats
              xp={xp}
              streak={streak}
              quizzesTaken={quizzesTaken}
              avgScore={avgScore}
              lastQuizDate={currentUser?.lastQuizDate}
            />

            {/* SRS Review Section */}
            {srsStats && <ReviewCard stats={srsStats} />}

            <section className="flex flex-col gap-4" aria-label="Quick Actions">
              <h2 className="text-xl font-bold text-foreground">
                Quick Actions
              </h2>
              <QuickActions />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
