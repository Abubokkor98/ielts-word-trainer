'use client';

import { Box, Flex, Heading, SimpleGrid, VStack } from '@chakra-ui/react';
import { Activity, BookOpen, TrendingUp, Users } from 'lucide-react';
import { AlertSection } from './components/AlertSection';
import { DAUTrendChart } from './components/DAUTrendChart';
import { DifficultyDistributionChart } from './components/DifficultyDistributionChart';
import { MetricCard } from './components/MetricCard';
import { ModuleDistributionChart } from './components/ModuleDistributionChart';
import { ProblemWordsCard } from './components/ProblemWordsCard';
import { QuickActions } from './components/QuickActions';
import { TopicDistributionChart } from './components/TopicDistributionChart';
import { TopWordsCard } from './components/TopWordsCard';
import { UnusedWordsCard } from './components/UnusedWordsCard';
import { VocabularyOverviewCard } from './components/VocabularyOverviewCard';
import { useDashboardMetrics } from './hooks/use-dashboard-metrics';

export function DashboardContainer() {
  const { data: metrics, isLoading, isError } = useDashboardMetrics('7d');

  if (isLoading) {
    return <Box p={4}>Loading dashboard...</Box>;
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
    <Box py={6} px={4}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Dashboard Overview</Heading>
        </Flex>

        {/* Platform Health Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6}>
          <MetricCard
            label="Active Users"
            sublabel="Login Activity"
            value={metrics.activeUsers.current}
            change={metrics.activeUsers.percentChange}
            icon={Users}
            color="blue.500"
          />
          <MetricCard
            label="Active Learners"
            sublabel="Took a Quiz"
            value={metrics.activeLearners.current}
            change={metrics.activeLearners.percentChange}
            icon={BookOpen}
            color="purple.500"
          />
          <MetricCard
            label="New Users"
            sublabel="This Week"
            value={metrics.newUsers.current}
            change={metrics.newUsers.percentChange}
            icon={TrendingUp}
            color="green.500"
          />
          <MetricCard
            label="Completion"
            sublabel="Quiz Finish Rate"
            value={`${metrics.quizCompletionRate.current.toFixed(0)}%`}
            change={metrics.quizCompletionRate.percentChange}
            icon={Activity}
            color="orange.500"
          />
          <MetricCard
            label="Avg Score"
            sublabel="Overall"
            value={`${metrics.avgQuizScore.current.toFixed(0)}%`}
            change={metrics.avgQuizScore.percentChange}
            icon={BookOpen}
            color="red.500"
          />
        </SimpleGrid>

        {/* Alerts Section */}
        <AlertSection alerts={metrics.alerts} />

        {/* Charts & Actions Grid */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
          {/* DAU Chart (Takes 2 columns) */}
          <Box gridColumn={{ lg: 'span 2' }}>
            <DAUTrendChart data={metrics.dailyActiveUsers} />
          </Box>

          {/* Quick Actions (Takes 1 column) */}
          <Box>
            <QuickActions />
          </Box>
        </SimpleGrid>

        {/* Problem Words Section */}
        <Box>
          <ProblemWordsCard />
        </Box>

        {/* Vocabulary Analytics Section */}
        <Box>
          <Heading size="md" mb={4}>
            Vocabulary Analytics
          </Heading>

          {/* Overview KPIs */}
          <Box mb={6}>
            <VocabularyOverviewCard />
          </Box>

          {/* Distribution Charts */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mb={6}>
            <ModuleDistributionChart />
            <DifficultyDistributionChart />
            <TopicDistributionChart />
          </SimpleGrid>

          {/* Top & Unused Words */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <TopWordsCard />
            <UnusedWordsCard />
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
}
