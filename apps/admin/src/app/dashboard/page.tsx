'use client';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent } from '@ielts/ui';
import { DashboardChart } from '@ielts/ui';
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Skeleton,
  useColorModeValue,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { Users, BookOpen, FileText, Activity } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  bg: string;
}

interface WordDifficulty {
  _id: string;
  count: number;
}

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const cardBg = useColorModeValue('white', 'gray.800');

  // Auth checks handled by DashboardLayout

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/stats');
      return data.data;
    },
    // We can assume auth is valid here due to AuthGuard, but keep enabled check for safety
    enabled: !!user && ['admin', 'super_admin'].includes(user.role),
  });

  if (statsLoading) {
    return (
      <Box minH="100vh" py={8}>
        <VStack spacing={8} align="stretch">
          <Skeleton height="60px" />
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="120px" borderRadius="xl" />
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    );
  }

  // Transform wordsByDifficulty for chart
  const difficultyData =
    stats?.wordsByDifficulty?.map((item: WordDifficulty) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      count: item.count,
    })) || [];

  return (
    <Box minH="100vh" py={4}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Dashboard Overview
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Welcome back, {user?.name}
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <StatCard
            label="Total Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            color="blue.500"
            bg={cardBg}
          />
          <StatCard
            label="Total Vocabulary"
            value={stats?.totalWords || 0}
            icon={BookOpen}
            color="purple.500"
            bg={cardBg}
          />
          <StatCard
            label="Quiz Attempts"
            value={stats?.totalQuizAttempts || 0}
            icon={FileText}
            color="green.500"
            bg={cardBg}
          />
          <StatCard
            label="Avg Quiz Score"
            value={`${Math.round(stats?.quizStats?.avgScore || 0)}%`}
            icon={Activity}
            color="orange.500"
            bg={cardBg}
          />
        </SimpleGrid>

        {/* Charts Section */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <Card className="p-6">
            <Heading size="md" mb={6}>
              Vocabulary Distribution
            </Heading>
            <Box h="300px">
              <DashboardChart
                type="bar"
                data={difficultyData}
                xAxisKey="name"
                dataKeys={[{ key: 'count', color: '#805AD5', name: 'Words' }]}
              />
            </Box>
          </Card>

          <Card className="p-6">
            <Heading size="md" mb={6}>
              Metrics Overview
            </Heading>
            <Box
              h="300px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.500">More analytics coming soon...</Text>
            </Box>
          </Card>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

// Shared Component
const StatCard = ({ label, value, icon, color, bg }: StatCardProps) => (
  <Card
    className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md"
    style={{ backgroundColor: bg }}
  >
    <CardContent className="p-6">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="sm" color="gray.500" fontWeight="600" mb={1}>
            {label}
          </Text>
          <Heading size="xl" color={color}>
            {value}
          </Heading>
        </Box>
        <Box
          p={3}
          bg={color.includes('.') ? `${color.split('.')[0]}.50` : `${color}50`}
          borderRadius="xl"
          color={color}
        >
          <Icon as={icon} boxSize={6} />
        </Box>
      </Flex>
    </CardContent>
  </Card>
);
