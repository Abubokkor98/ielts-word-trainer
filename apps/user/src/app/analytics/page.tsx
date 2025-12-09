'use client';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/shared';
import { Card, CardHeader, CardContent } from '@ielts/ui';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
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
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', 'me'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/quiz/analytics/me');
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.900" py={8}>
        <Container maxW="7xl">
          <VStack spacing={8} align="stretch">
            <Skeleton height="60px" />
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height="100px" />
              ))}
            </SimpleGrid>
            <Skeleton height="300px" />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (!analytics || analytics.totalQuizzes === 0) {
    return (
      <Box
        minH="100vh"
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Text fontSize="4xl">📊</Text>
          <Heading size="lg" color="gray.50">
            No Quiz Data Yet
          </Heading>
          <Text color="gray.400">Take some quizzes to see your analytics!</Text>
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
          <Box>
            <Heading as="h1" size="2xl" color="gray.50" mb={2}>
              Quiz Analytics
            </Heading>
            <Text fontSize="lg" color="gray.400">
              Track your performance
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <StatCard
              label="TOTAL QUIZZES"
              value={analytics.totalQuizzes}
              color="brand.400"
            />
            <StatCard
              label="AVG SCORE"
              value={`${analytics.averageScore}%`}
              color="success.400"
            />
            <StatCard
              label="BEST SCORE"
              value={`${analytics.bestScore}%`}
              color="warning.400"
            />
            <StatCard
              label="ACCURACY"
              value={`${overallAccuracy}%`}
              color="brand.400"
            />
          </SimpleGrid>

          {analytics.performanceOverTime?.length > 0 && (
            <Card>
              <CardHeader>
                <Heading size="md" color="gray.50">
                  Performance Trend
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
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#1e88e5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {analytics.accuracyByDifficulty?.length > 0 && (
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
                    />
                    <Bar dataKey="accuracy" fill="#1e88e5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {analytics.recentAttempts?.length > 0 && (
            <Card>
              <CardHeader>
                <Heading size="md" color="gray.50">
                  Recent Attempts
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
                      </Tr>
                    </Thead>
                    <Tbody>
                      {analytics.recentAttempts.map((attempt: any) => (
                        <Tr key={attempt._id}>
                          <Td color="gray.300">
                            {new Date(attempt.completedAt).toLocaleDateString()}
                          </Td>
                          <Td>
                            <Badge>{attempt.difficulty}</Badge>
                          </Td>
                          <Td color="gray.300" isNumeric>
                            {attempt.score}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

const StatCard = ({ label, value, color }: any) => (
  <Card>
    <CardContent>
      <VStack align="start" spacing={1}>
        <Text fontSize="sm" color="gray.400" fontWeight="600">
          {label}
        </Text>
        <Heading size="2xl" color={color}>
          {value}
        </Heading>
      </VStack>
    </CardContent>
  </Card>
);
