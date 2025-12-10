'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/shared';
import { useAuthStore } from '@ielts/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, Button, Input } from '@ielts/ui';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Select,
  Skeleton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';

export default function AdminDashboardPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const toast = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Protect route - redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'admin') {
      // Redirect non-admin users to user app
      if (typeof window !== 'undefined') {
        window.location.href = 'http://localhost:3000/dashboard';
      }
    }
  }, [isAuthenticated, user, router]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/stats');
      return data.data;
    },
    enabled: !!user && user.role === 'admin',
  });

  const { data: wordsData, isLoading: wordsLoading } = useQuery({
    queryKey: ['admin', 'words', page, search, difficulty],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (search) params.append('search', search);
      if (difficulty !== 'all') params.append('difficulty', difficulty);

      const { data } = await axiosInstance.get(
        `/admin/words?${params.toString()}`
      );
      return data.data;
    },
    enabled: !!user && user.role === 'admin',
  });

  const deleteWordMutation = useMutation({
    mutationFn: async (wordId: string) => {
      await axiosInstance.delete(`/admin/words/${wordId}`);
    },
    onSuccess: () => {
      toast({ title: 'Word deleted successfully', status: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: () => {
      toast({ title: 'Failed to delete word', status: 'error' });
    },
  });

  const handleDelete = (wordId: string) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      deleteWordMutation.mutate(wordId);
    }
  };

  // Don't render if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (statsLoading) {
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
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="2xl" color="gray.50" mb={2}>
              Admin Dashboard
            </Heading>
            <Text fontSize="lg" color="gray.400">
              Manage words and view system statistics
            </Text>
          </Box>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              color="brand.400"
            />
            <StatCard
              label="Total Words"
              value={stats.totalWords}
              color="purple.400"
            />
            <StatCard
              label="Quiz Attempts"
              value={stats.totalQuizAttempts}
              color="green.400"
            />
            <StatCard
              label="Avg Score"
              value={`${Math.round(stats.quizStats?.avgScore || 0)}%`}
              color="orange.400"
            />
          </SimpleGrid>

          {/* Words by Difficulty */}
          {stats.wordsByDifficulty && (
            <Card>
              <CardHeader>
                <Heading size="md" color="gray.50">
                  Words by Difficulty
                </Heading>
              </CardHeader>
              <CardContent>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  {stats.wordsByDifficulty.map((item: any) => (
                    <Box key={item._id} p={4} bg="gray.800" borderRadius="md">
                      <Text
                        color="gray.400"
                        fontSize="sm"
                        textTransform="capitalize"
                      >
                        {item._id}
                      </Text>
                      <Text color="gray.50" fontSize="2xl" fontWeight="bold">
                        {item.count}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </CardContent>
            </Card>
          )}

          {/* Tabs for Word Management */}
          <Tabs colorScheme="brand">
            <TabList borderColor="gray.700">
              <Tab
                color="gray.400"
                _selected={{ color: 'brand.400', borderColor: 'brand.400' }}
              >
                Word Management
              </Tab>
              <Tab
                color="gray.400"
                _selected={{ color: 'brand.400', borderColor: 'brand.400' }}
              >
                Recent Users
              </Tab>
            </TabList>

            <TabPanels>
              {/* Word Management Tab */}
              <TabPanel px={0}>
                <Card>
                  <CardHeader>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md" color="gray.50">
                        Manage Words
                      </Heading>
                      <HStack spacing={4}>
                        <Input
                          placeholder="Search words..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          bg="gray.800"
                        />
                        <Select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          bg="gray.800"
                          w="200px"
                        >
                          <option value="all">All Levels</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </Select>
                      </HStack>
                    </VStack>
                  </CardHeader>
                  <CardContent>
                    {wordsLoading ? (
                      <VStack spacing={2}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Skeleton key={i} height="50px" w="full" />
                        ))}
                      </VStack>
                    ) : (
                      <>
                        <Box overflowX="auto">
                          <Table variant="simple">
                            <Thead>
                              <Tr>
                                <Th color="gray.400">Word</Th>
                                <Th color="gray.400">Meaning</Th>
                                <Th color="gray.400">Difficulty</Th>
                                <Th color="gray.400">Actions</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {wordsData?.words.map((word: any) => (
                                <Tr key={word._id}>
                                  <Td color="gray.300" fontWeight="600">
                                    {word.word}
                                  </Td>
                                  <Td color="gray.400" maxW="300px" isTruncated>
                                    {word.meaning}
                                  </Td>
                                  <Td>
                                    <Badge
                                      colorScheme={
                                        word.difficulty === 'beginner'
                                          ? 'green'
                                          : word.difficulty === 'intermediate'
                                          ? 'blue'
                                          : 'purple'
                                      }
                                    >
                                      {word.difficulty}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDelete(word._id)}
                                      isLoading={deleteWordMutation.isPending}
                                    >
                                      Delete
                                    </Button>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Box>

                        <HStack justify="center" mt={6} spacing={4}>
                          <Button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            isDisabled={page === 1}
                            variant="outline"
                          >
                            Previous
                          </Button>
                          <Text color="gray.400">
                            Page {page} of{' '}
                            {wordsData?.pagination.totalPages || 1}
                          </Text>
                          <Button
                            onClick={() =>
                              setPage((p) =>
                                Math.min(
                                  wordsData?.pagination.totalPages || 1,
                                  p + 1
                                )
                              )
                            }
                            isDisabled={
                              page === wordsData?.pagination.totalPages
                            }
                            variant="outline"
                          >
                            Next
                          </Button>
                        </HStack>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabPanel>

              {/* Recent Users Tab */}
              <TabPanel px={0}>
                <Card>
                  <CardHeader>
                    <Heading size="md" color="gray.50">
                      Recent Users
                    </Heading>
                  </CardHeader>
                  <CardContent>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th color="gray.400">Name</Th>
                          <Th color="gray.400">Email</Th>
                          <Th color="gray.400">XP</Th>
                          <Th color="gray.400">Joined</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {stats.recentUsers?.map((user: any) => (
                          <Tr key={user._id}>
                            <Td color="gray.300">{user.name}</Td>
                            <Td color="gray.400">{user.email}</Td>
                            <Td color="gray.300">{user.xp}</Td>
                            <Td color="gray.400">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardContent>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}

// Shared Component
const StatCard = ({ label, value, color }: any) => (
  <Card role="region" aria-label={`${label} statistic`}>
    <CardContent>
      <VStack align="start" spacing={1}>
        <Text fontSize="sm" color="gray.400" fontWeight="600">
          {label}
        </Text>
        <Heading size="2xl" color={color} aria-label={`${label}: ${value}`}>
          {value}
        </Heading>
      </VStack>
    </CardContent>
  </Card>
);
