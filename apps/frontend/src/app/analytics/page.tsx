'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { Card, CardHeader, CardContent } from '@ielts/ui';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  useToast,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface QuizAttempt {
  _id: string;
  score: number;
  totalQuestions: number;
  difficulty: string;
  completedAt: string;
}

interface Analytics {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  recentAttempts: QuizAttempt[];
  performanceOverTime: Array<{ date: string; score: number }>;
  accuracyByDifficulty: Array<{
    difficulty: string;
    accuracy: number;
    count: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Please login first',
          status: 'warning',
          duration: 3000,
          position: 'top',
        });
        router.push('/login');
        return;
      }

      const { data } = await api.get('/quiz/analytics/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (err: any) {
      toast({
        title: 'Error loading analytics',
        description: err.response?.data?.message || 'Unable to fetch analytics',
        status: 'error',
        duration: 5000,
        position: 'top',
      });
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

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
            Loading analytics...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (!analytics) {
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
            No analytics data available
          </Text>
          <Text fontSize="md" color="gray.500">
            Take some quizzes to see your performance!
          </Text>
        </VStack>
      </Box>
    );
  }

  const overallAccuracy =
    analytics.totalQuestionsAnswered > 0
      ? Math.round(
          (analytics.correctAnswers / analytics.totalQuestionsAnswered) * 100
        )
      : 0;

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Container maxW="7xl">
        <VStack align="stretch" spacing={8}>
          {/* Header */}
          <Box>
            <Heading as="h1" size="2xl" color="gray.50" mb={2}>
              Quiz Analytics
            </Heading>
            <Text fontSize="lg" color="gray.400">
              Track your quiz performance and progress over time
            </Text>
          </Box>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card>
              <CardContent>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.400" fontWeight="600">
                    TOTAL QUIZZES
                  </Text>
                  <Heading size="2xl" color="brand.400">
                    {analytics.totalQuizzes}
                  </Heading>
                </VStack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.400" fontWeight="600">
                    AVERAGE SCORE
                  </Text>
                  <Heading size="2xl" color="success.400">
                    {analytics.averageScore}%
                  </Heading>
                </VStack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.400" fontWeight="600">
                    BEST SCORE
                  </Text>
                  <Heading size="2xl" color="warning.400">
                    {analytics.bestScore}%
                  </Heading>
                </VStack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.400" fontWeight="600">
                    ACCURACY
                  </Text>
                  <Heading size="2xl" color="brand.400">
                    {overallAccuracy}%
                  </Heading>
                </VStack>
              </CardContent>
            </Card>
          </SimpleGrid>

          {/* Performance Over Time Chart */}
          {analytics.performanceOverTime &&
            analytics.performanceOverTime.length > 0 && (
              <Card>
                <CardHeader>
                  <Heading size="md" color="gray.50">
                    Performance Over Time
                  </Heading>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.performanceOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                      <XAxis dataKey="date" stroke="#cbd5e0" />
                      <YAxis stroke="#cbd5e0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#2d3748',
                          border: '1px solid #4a5568',
                        }}
                        labelStyle={{ color: '#cbd5e0' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#1e88e5"
                        strokeWidth={2}
                        name="Score %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

          {/* Accuracy by Difficulty Chart */}
          {analytics.accuracyByDifficulty &&
            analytics.accuracyByDifficulty.length > 0 && (
              <Card>
                <CardHeader>
                  <Heading size="md" color="gray.50">
                    Accuracy by Difficulty
                  </Heading>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.accuracyByDifficulty}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                      <XAxis dataKey="difficulty" stroke="#cbd5e0" />
                      <YAxis stroke="#cbd5e0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#2d3748',
                          border: '1px solid #4a5568',
                        }}
                        labelStyle={{ color: '#cbd5e0' }}
                      />
                      <Legend />
                      <Bar
                        dataKey="accuracy"
                        fill="#1e88e5"
                        name="Accuracy %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

          {/* Recent Quiz Attempts Table */}
          {analytics.recentAttempts && analytics.recentAttempts.length > 0 && (
            <Card>
              <CardHeader>
                <Heading size="md" color="gray.50">
                  Recent Quiz Attempts
                </Heading>
              </CardHeader>
              <CardContent>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th color="gray.400">Date</Th>
                        <Th color="gray.400">Difficulty</Th>
                        <Th color="gray.400" isNumeric>
                          Score
                        </Th>
                        <Th color="gray.400" isNumeric>
                          Questions
                        </Th>
                        <Th color="gray.400" isNumeric>
                          Percentage
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {analytics.recentAttempts.map((attempt) => {
                        const percentage = Math.round(
                          (attempt.score / attempt.totalQuestions) * 100
                        );
                        return (
                          <Tr key={attempt._id}>
                            <Td color="gray.300">
                              {new Date(
                                attempt.completedAt
                              ).toLocaleDateString()}
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  attempt.difficulty === 'beginner'
                                    ? 'green'
                                    : attempt.difficulty === 'intermediate'
                                    ? 'orange'
                                    : 'red'
                                }
                              >
                                {attempt.difficulty}
                              </Badge>
                            </Td>
                            <Td color="gray.300" isNumeric>
                              {attempt.score}
                            </Td>
                            <Td color="gray.300" isNumeric>
                              {attempt.totalQuestions}
                            </Td>
                            <Td isNumeric>
                              <Text
                                color={
                                  percentage >= 70
                                    ? 'green.400'
                                    : percentage >= 50
                                    ? 'orange.400'
                                    : 'red.400'
                                }
                                fontWeight="bold"
                              >
                                {percentage}%
                              </Text>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {analytics.totalQuizzes === 0 && (
            <Card>
              <CardContent>
                <VStack spacing={4} py={8}>
                  <Text fontSize="3xl">📊</Text>
                  <Heading size="md" color="gray.50">
                    No Quiz Data Yet
                  </Heading>
                  <Text color="gray.400" textAlign="center">
                    Take some quizzes to see your performance analytics!
                  </Text>
                </VStack>
              </CardContent>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
