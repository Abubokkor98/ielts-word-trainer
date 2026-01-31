'use client';

import { Box, Flex, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
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
      <Box p={4}>
        <Heading size="md" color="red.500" mb={2}>
          Error loading dashboard data.
        </Heading>
        <Box
          as="button"
          px={4}
          py={2}
          bg="blue.500"
          color="white"
          borderRadius="md"
          _hover={{ bg: 'blue.600' }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Box>
      </Box>
    );
  }

  return (
    <Box py={8} px={8} maxW="1920px" mx="auto">
      <VStack spacing={10} align="stretch">
        {/* Platform Health Section */}
        <DashboardSection
          title="Platform Health"
          subtitle="Key metrics for the last 7 days"
        >
          <StatsGrid>
            <MetricCard
              label="Active Users"
              sublabel="vs last week"
              value={metrics.activeUsers.current}
              change={metrics.activeUsers.percentChange}
              icon={Users}
              color="blue.500"
            />
            <MetricCard
              label="Active Learners"
              sublabel="vs last week"
              value={metrics.activeLearners.current}
              change={metrics.activeLearners.percentChange}
              icon={BookOpen}
              color="purple.500"
            />
            <MetricCard
              label="New Users"
              sublabel="vs last week"
              value={metrics.newUsers.current}
              change={metrics.newUsers.percentChange}
              icon={TrendingUp}
              color="green.500"
            />
            <MetricCard
              label="Completion Rate"
              sublabel="vs last week"
              value={`${metrics.quizCompletionRate.current.toFixed(0)}%`}
              change={metrics.quizCompletionRate.percentChange}
              icon={Activity}
              color="orange.500"
            />
            <MetricCard
              label="Avg Score"
              sublabel="vs last week"
              value={`${metrics.avgQuizScore.current.toFixed(0)}%`}
              change={metrics.avgQuizScore.percentChange}
              icon={BookOpen}
              color="red.500"
            />
          </StatsGrid>
        </DashboardSection>

        {/* Actionable Insights Section */}
        <DashboardSection title="Activity & Actions">
          <AlertSection alerts={metrics.alerts} />

          <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={6} mt={6}>
            <Box gridColumn={{ xl: 'span 2' }}>
              <DAUTrendChart data={metrics.dailyActiveUsers} />
            </Box>
            <Box>
              <QuickActions />
            </Box>
          </SimpleGrid>
        </DashboardSection>

        {/* Deep Dive Section */}
        <DashboardSection
          title="Content Insights"
          subtitle="Vocabulary performance and distribution"
        >
          <VStack spacing={6} align="stretch">
            <VocabularyOverviewCard />

            <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={6}>
              <ModuleDistributionChart />
              <DifficultyDistributionChart />
              <TopicDistributionChart />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={6}>
              <TopWordsCard />
              <UnusedWordsCard />
              <ProblemWordsCard />
            </SimpleGrid>
          </VStack>
        </DashboardSection>
      </VStack>
    </Box>
  );
}
