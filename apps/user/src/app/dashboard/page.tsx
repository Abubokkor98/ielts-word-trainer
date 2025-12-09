'use client';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
import { useAuthStore } from '@ielts/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Skeleton,
  HStack,
} from '@chakra-ui/react';
import { Card, CardHeader, CardContent } from '@ielts/ui';
import Link from 'next/link';

export default function UserDashboardPage() {
  const { user: localUser, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Protect route - redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/auth/me');
      return data.data;
    },
    enabled: !!localUser,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics', 'me'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/quiz/analytics/me');
      return data.data;
    },
    enabled: !!localUser,
  });

  if (userLoading || analyticsLoading) {
    return (
      <Box minH="100vh" bg="gray.900" py={8}>
        <Container maxW="7xl">
          <VStack spacing={8} align="stretch">
            <Skeleton height="60px" />
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height="120px" />
              ))}
            </SimpleGrid>
            <Skeleton height="200px" />
          </VStack>
        </Container>
      </Box>
    );
  }

  const currentUser = user || localUser;
  const xp = currentUser?.xp || 0;
  const streak = currentUser?.streak || 0;
  const quizzesTaken = analytics?.totalQuizzes || 0;
  const avgScore = analytics?.averageScore || 0;

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
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

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatCard label="Total XP" value={xp} color="brand.400" />
            <StatCard
              label="Current Streak"
              value={streak}
              icon="🔥"
              color="orange.400"
            />
            <StatCard
              label="Quizzes Taken"
              value={quizzesTaken}
              color="purple.400"
            />
            <StatCard
              label="Average Score"
              value={`${avgScore}%`}
              color="green.400"
            />
          </SimpleGrid>

          <Heading size="lg" color="gray.50">
            Quick Actions
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <ActionCard
              href="/vocabulary"
              title="Browse Vocabulary"
              description="Explore 3000+ IELTS words"
              emoji="📚"
            />
            <ActionCard
              href="/quiz"
              title="Take a Quiz"
              description="Test your knowledge now"
              emoji="🎯"
            />
            <ActionCard
              href="/analytics"
              title="View Analytics"
              description="Check your progress"
              emoji="📊"
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}

// Shared Components
const StatCard = ({ label, value, icon, color }: any) => (
  <Card role="region" aria-label={`${label} statistic`}>
    <CardContent>
      <VStack align="start" spacing={1}>
        <Text fontSize="sm" color="gray.400" fontWeight="600">
          {label}
        </Text>
        <HStack>
          <Heading size="2xl" color={color} aria-label={`${label}: ${value}`}>
            {value}
          </Heading>
          {icon && (
            <Text fontSize="2xl" aria-hidden="true">
              {icon}
            </Text>
          )}
        </HStack>
      </VStack>
    </CardContent>
  </Card>
);

const ActionCard = ({ href, title, description, emoji }: any) => (
  <Link
    href={href}
    style={{ textDecoration: 'none' }}
    aria-label={`${title}: ${description}`}
  >
    <Card
      _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}
      cursor="pointer"
      role="button"
      tabIndex={0}
    >
      <CardHeader>
        <Text fontSize="3xl" mb={2} aria-hidden="true">
          {emoji}
        </Text>
        <Heading size="md" color="brand.400">
          {title}
        </Heading>
      </CardHeader>
      <CardContent>
        <Text color="gray.400" fontSize="sm">
          {description}
        </Text>
      </CardContent>
    </Card>
  </Link>
);
