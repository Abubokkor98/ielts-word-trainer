'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
import { useAuthStore } from '@ielts/auth';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  HStack,
  Badge,
  useDisclosure,
  Skeleton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  VStack,
  Tabs,
  TabList,
  Tab,
} from '@chakra-ui/react';
import { Search, X } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Pagination,
} from '@ielts/ui';
import { WordDetailsModal } from '@ielts/ui';

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function VocabularyPage() {
  const [page, setPage] = useState(1);
  const [difficulty, setDifficulty] = useState('all');
  const [wordSearchQuery, setWordSearchQuery] = useState('');
  const [topicSearchQuery, setTopicSearchQuery] = useState('');

  const debouncedWordSearch = useDebounce(wordSearchQuery, 500);
  const debouncedTopicSearch = useDebounce(topicSearchQuery, 500);

  const [selectedWord, setSelectedWord] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuthStore();
  const router = useRouter();

  // Redirect admins to dashboard - vocabulary is for regular users only
  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const { data, isLoading } = useQuery({
    queryKey: [
      'words',
      page,
      difficulty,
      debouncedWordSearch,
      debouncedTopicSearch,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      if (difficulty !== 'all') params.append('difficulty', difficulty);

      if (debouncedWordSearch) params.append('search', debouncedWordSearch);
      if (debouncedTopicSearch)
        params.append('topicName', debouncedTopicSearch);

      const { data } = await axiosInstance.get(`/words?${params.toString()}`);
      return data.data;
    },
  });

  const words = data?.words || [];
  const totalPages = data?.totalPages || 1;

  const handleViewDetails = (word: any) => {
    setSelectedWord(word);
    onOpen();
  };

  const difficultyColors: Record<string, string> = {
    beginner: 'green',
    intermediate: 'blue',
    advanced: 'purple',
  };

  return (
    <Box bg="gray.900" py={8}>
      <Container maxW="7xl">
        <Box mb={8}>
          <Heading as="h1" size="2xl" color="gray.50" mb={2}>
            Vocabulary Library
          </Heading>
          <Text fontSize="lg" color="gray.400" mb={6}>
            Explore and master essential IELTS vocabulary
          </Text>

          <HStack justify="space-between" wrap="wrap" spacing={4} mb={6}>
            <HStack spacing={2} overflowX="auto">
              {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                <Button
                  key={level}
                  onClick={() => {
                    setDifficulty(level);
                    setPage(1);
                  }}
                  variant={difficulty === level ? 'solid' : 'outline'}
                  colorScheme={difficulty === level ? 'brand' : 'gray'}
                  size="sm"
                  textTransform="capitalize"
                >
                  {level}
                </Button>
              ))}
            </HStack>

            <HStack
              spacing={4}
              flex={1}
              justify="flex-end"
              minW={{ base: '100%', md: 'auto' }}
            >
              <InputGroup size="md" maxW={{ base: '100%', md: '250px' }}>
                <InputLeftElement pointerEvents="none">
                  <Search color="gray.500" size={16} />
                </InputLeftElement>
                <Input
                  placeholder="Search vocabulary..."
                  bg="gray.800"
                  border="1px"
                  borderColor="gray.700"
                  color="white"
                  _focus={{
                    ring: 2,
                    ringColor: 'brand.500',
                    borderColor: 'transparent',
                  }}
                  value={wordSearchQuery}
                  onChange={(e) => {
                    setWordSearchQuery(e.target.value);
                    setPage(1);
                  }}
                />
                {wordSearchQuery && (
                  <InputRightElement>
                    <X
                      size={16}
                      color="gray"
                      cursor="pointer"
                      onClick={() => {
                        setWordSearchQuery('');
                        setPage(1);
                      }}
                    />
                  </InputRightElement>
                )}
              </InputGroup>

              <InputGroup size="md" maxW={{ base: '100%', md: '300px' }}>
                <InputLeftElement pointerEvents="none">
                  <Search color="gray.500" size={16} />
                </InputLeftElement>
                <Input
                  placeholder="Search topics..."
                  bg="gray.800"
                  border="1px"
                  borderColor="gray.700"
                  color="white"
                  _focus={{
                    ring: 2,
                    ringColor: 'brand.500',
                    borderColor: 'transparent',
                  }}
                  value={topicSearchQuery}
                  onChange={(e) => {
                    setTopicSearchQuery(e.target.value);
                    setPage(1);
                  }}
                />
                {topicSearchQuery && (
                  <InputRightElement>
                    <X
                      size={16}
                      color="gray"
                      cursor="pointer"
                      onClick={() => {
                        setTopicSearchQuery('');
                        setPage(1);
                      }}
                    />
                  </InputRightElement>
                )}
              </InputGroup>
            </HStack>
          </HStack>
        </Box>

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} height="220px" borderRadius="md" />
            ))}
          </SimpleGrid>
        ) : words.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text color="gray.400" fontSize="lg">
              No vocabulary found matching your criteria.
            </Text>
            {(wordSearchQuery || topicSearchQuery) && (
              <Button
                mt={4}
                variant="outline"
                size="sm"
                onClick={() => {
                  setWordSearchQuery('');
                  setTopicSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {words.map((word: any) => (
              <Card key={word._id}>
                <CardHeader>
                  <HStack justify="space-between" align="start">
                    <Heading as="h3" size="md" color="brand.400">
                      {word.word}
                    </Heading>
                    <Badge
                      colorScheme={difficultyColors[word.difficulty] || 'gray'}
                    >
                      {word.difficulty}
                    </Badge>
                  </HStack>
                </CardHeader>
                <CardContent>
                  <Text color="gray.300" noOfLines={2} fontSize="sm">
                    {word.meaning}
                  </Text>
                  <Text color="gray.500" fontSize="xs" mt={2}>
                    Example: {word.exampleSentence}
                  </Text>
                </CardContent>
                <CardFooter>
                  <Button
                    width="100%"
                    size="sm"
                    onClick={() => handleViewDetails(word)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {words.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <WordDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          word={selectedWord}
        />
      </Container>
    </Box>
  );
}
