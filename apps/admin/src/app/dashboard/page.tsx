'use client';

import { Box, Flex, Heading, SimpleGrid, VStack } from '@chakra-ui/react';
import { Activity, BookOpen, TrendingUp, Users } from 'lucide-react';
import { AlertSection } from '../../components/dashboard/AlertSection';
import { DAUTrendChart } from '../../components/dashboard/DAUTrendChart';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { ProblemWordsCard } from '../../components/dashboard/ProblemWordsCard';
import { useDashboardMetrics } from '../../hooks/use-dashboard-metrics';

export default function AdminDashboardPage() {
  const { data: metrics, isLoading, isError } = useDashboardMetrics('7d');

  if (isLoading) {
    return <Box p={4}>Loading dashboard...</Box>;
  }

  if (isError || !metrics) {
    return <Box p={4}>Error loading dashboard data.</Box>;
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
      </VStack>
    </Box>
  );
}
