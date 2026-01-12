'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@ielts/auth';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { ReviewCard } from '../../components/ReviewCard';

import { useDashboardData } from './hooks/use-dashboard-data';
import { DashboardStats } from './components/dashboard-stats';
import { QuickActions } from './components/quick-actions';
import { DashboardSkeleton } from './components/dashboard-skeleton';

export function DashboardContainer() {
  const { user: localUser, isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();

  // Redirect to login if not authenticated (but wait for hydration first)
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  const { user, analytics, srsStats, isLoading } = useDashboardData(
    isAuthenticated,
    localUser
  );

  // Show loading during hydration
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

  const currentUser = user || localUser;
  const xp = currentUser?.xp || 0;
  const streak = currentUser?.streak || 0;
  const quizzesTaken = analytics?.totalQuizzes || 0;
  const avgScore = analytics?.averageScore || 0;

  return (
    <Box bg="gray.900" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="2xl" color="gray.50" mb={2}>
              Welcome back, {currentUser?.name}! 👋
            </Heading>
            <Text fontSize="lg" color="gray.400">
              Ready to continue your IELTS journey?
            </Text>
          </Box>

          <DashboardStats
            xp={xp}
            streak={streak}
            quizzesTaken={quizzesTaken}
            avgScore={avgScore}
            lastQuizDate={currentUser?.lastQuizDate}
          />

          {/* SRS Review Section */}
          {srsStats && <ReviewCard stats={srsStats} />}

          <Heading size="lg" color="gray.50">
            Quick Actions
          </Heading>

          <QuickActions />
        </VStack>
      </Container>
    </Box>
  );
}
