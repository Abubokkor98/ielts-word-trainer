'use client';

import { Box, Container, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { AnalyticsEmptyState } from './components/analytics-empty-state';
import { AnalyticsSkeleton } from './components/analytics-skeleton';
import { AnalyticsStatCard } from './components/analytics-stat-card';
import { DifficultyChart } from './components/difficulty-chart';
import { PerformanceChart } from './components/performance-chart';
import { RecentAttemptsTable } from './components/recent-attempts-table';
import { useAnalytics } from './hooks/use-analytics';

export function AnalyticsContainer() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (!analytics || analytics.totalQuizzes === 0) {
    return <AnalyticsEmptyState />;
  }

  const overallAccuracy =
    analytics.totalQuestionsAnswered > 0
      ? Math.round((analytics.correctAnswers / analytics.totalQuestionsAnswered) * 100)
      : 0;

  return (
    <Box bg="gray.900" py={8}>
      <Container maxW="7xl">
        <VStack align="stretch" spacing={8}>
          <Box>
            <Heading as="h1" size="2xl" color="gray.50" mb={2}>
              Quiz Analytics
            </Heading>
            <Text fontSize="lg" color="gray.400">
              Track your performance
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <AnalyticsStatCard
              label="TOTAL QUIZZES"
              value={analytics.totalQuizzes}
              color="brand.400"
            />
            <AnalyticsStatCard
              label="AVG SCORE"
              value={`${analytics.averageScore}%`}
              color="green.400" // Changed from success.400 to standard green.400 to match dashboard
            />
            <AnalyticsStatCard
              label="BEST SCORE"
              value={`${analytics.bestScore}%`}
              color="orange.400" // Changed from warning.400 to orange.400
            />
            <AnalyticsStatCard label="ACCURACY" value={`${overallAccuracy}%`} color="brand.400" />
          </SimpleGrid>

          <PerformanceChart data={analytics.performanceOverTime} />

          <DifficultyChart data={analytics.accuracyByDifficulty} />

          <RecentAttemptsTable attempts={analytics.recentAttempts} />
        </VStack>
      </Container>
    </Box>
  );
}
