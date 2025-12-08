'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { Card, CardHeader, CardContent } from '@ielts/ui';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  useToast,
} from '@chakra-ui/react';

interface UserStats {
  totalWordsLearned: number;
  quizzesTaken: number;
  averageScore: number;
  streak: number;
  xp: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast({
        title: 'Please login first',
        status: 'warning',
        duration: 3000,
        position: 'top',
      });
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // For now, create mock stats based on user data
    // In a real app, this would come from an API endpoint like /users/me/stats
    const mockStats: UserStats = {
      totalWordsLearned: 8, // Number of words in vocabulary
      quizzesTaken: 0,
      averageScore: 0,
      streak: userData.streak || 0,
      xp: userData.xp || 0,
    };

    setStats(mockStats);
    setLoading(false);
  }, [router, toast]);

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Text fontSize="xl" color="gray.400">
            Loading your dashboard...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (!stats || !user) {
    return (
      <Box
        minH="100vh"
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Text fontSize="xl" color="gray.400">
            Unable to load dashboard
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Container maxW="7xl">
        <VStack align="stretch" spacing={8}>
          {/* Welcome Header */}
          <Box>
            <Heading as="h1" size="2xl" color="gray.50" mb={2}>
              Welcome back, {user.name}!
            </Heading>
            <Text fontSize="lg" color="gray.400">
              Track your IELTS vocabulary learning progress
            </Text>
          </Box>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {/* XP Card */}
            <Card>
              <CardHeader>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.400" fontWeight="600">
                    TOTAL XP
                  </Text>
                  <Heading size="3xl" color="brand.400">
                    {stats.xp}
                  </Heading>
                </VStack>
              </CardHeader>
              <CardContent>
                <Text fontSize="sm" color="gray.500">
                  Experience Points Earned
                </Text>
              </CardContent>
            </Card>

            {/* Streak Card */}
            <Card>
              <CardHeader>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.400" fontWeight="600">
                    STREAK
                  </Text>
                  <HStack>
                    <Heading size="3xl" color="warning.400">
                      {stats.streak}
                    </Heading>
                    <Text fontSize="2xl">🔥</Text>
                  </HStack>
                </VStack>
              </CardHeader>
              <CardContent>
                <Text fontSize="sm" color="gray.500">
                  Days in a row
                </Text>
              </CardContent>
            </Card>

            {/* Words Learned Card */}
            <Card>
              <CardHeader>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.400" fontWeight="600">
                    WORDS LEARNED
                  </Text>
                  <Heading size="3xl" color="success.400">
                    {stats.totalWordsLearned}
                  </Heading>
                </VStack>
              </CardHeader>
              <CardContent>
                <Text fontSize="sm" color="gray.500">
                  Vocabulary words mastered
                </Text>
              </CardContent>
            </Card>

            {/* Quizzes Card */}
            <Card>
              <CardHeader>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.400" fontWeight="600">
                    QUIZZES TAKEN
                  </Text>
                  <Heading size="3xl" color="brand.400">
                    {stats.quizzesTaken}
                  </Heading>
                </VStack>
              </CardHeader>
              <CardContent>
                <Text fontSize="sm" color="gray.500">
                  {stats.averageScore > 0
                    ? `${stats.averageScore}% avg`
                    : 'Take your first quiz!'}
                </Text>
              </CardContent>
            </Card>
          </SimpleGrid>

          {/* Quick Actions */}
          <Box>
            <Heading size="lg" color="gray.50" mb={4}>
              Quick Actions
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Link href="/vocabulary" style={{ textDecoration: 'none' }}>
                <Card
                  cursor="pointer"
                  _hover={{
                    borderColor: 'brand.600',
                    transform: 'translateY(-4px)',
                  }}
                  transition="all 0.2s"
                >
                  <CardHeader>
                    <Text fontSize="3xl" mb={2}>
                      📚
                    </Text>
                    <Heading size="md" color="brand.400">
                      Browse Vocabulary
                    </Heading>
                  </CardHeader>
                  <CardContent>
                    <Text fontSize="sm" color="gray.500">
                      Explore and learn new words
                    </Text>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/quiz" style={{ textDecoration: 'none' }}>
                <Card
                  cursor="pointer"
                  _hover={{
                    borderColor: 'brand.600',
                    transform: 'translateY(-4px)',
                  }}
                  transition="all 0.2s"
                >
                  <CardHeader>
                    <Text fontSize="3xl" mb={2}>
                      🎯
                    </Text>
                    <Heading size="md" color="brand.400">
                      Take a Quiz
                    </Heading>
                  </CardHeader>
                  <CardContent>
                    <Text fontSize="sm" color="gray.500">
                      Test your knowledge
                    </Text>
                  </CardContent>
                </Card>
              </Link>

              <Card
                cursor="pointer"
                _hover={{
                  borderColor: 'brand.600',
                  transform: 'translateY(-4px)',
                }}
                transition="all 0.2s"
              >
                <CardHeader>
                  <Text fontSize="3xl" mb={2}>
                    📊
                  </Text>
                  <Heading size="md" color="gray.400">
                    View Progress
                  </Heading>
                </CardHeader>
                <CardContent>
                  <Text fontSize="sm" color="gray.500">
                    Coming soon
                  </Text>
                </CardContent>
              </Card>
            </SimpleGrid>
          </Box>

          {/* User Info */}
          <Card>
            <CardHeader>
              <Heading size="md" color="gray.50">
                Profile Information
              </Heading>
            </CardHeader>
            <CardContent>
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <Text color="gray.400">Email:</Text>
                  <Text color="gray.200">{user.email}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.400">Role:</Text>
                  <Badge
                    colorScheme={user.role === 'admin' ? 'purple' : 'blue'}
                  >
                    {user.role}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.400">Account Status:</Text>
                  <Badge colorScheme="green">Active</Badge>
                </HStack>
              </VStack>
            </CardContent>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
