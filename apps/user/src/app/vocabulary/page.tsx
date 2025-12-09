'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/shared';
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
} from '@chakra-ui/react';
import { Card, CardHeader, CardContent, CardFooter } from '@ielts/ui';
import { WordDetailsModal } from '@ielts/ui';

export default function VocabularyPage() {
  const [page, setPage] = useState(1);
  const [difficulty, setDifficulty] = useState('all');
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
    queryKey: ['words', page, difficulty],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });
      if (difficulty !== 'all') params.append('difficulty', difficulty);

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
    <Box minH="100vh" bg="gray.900" py={8}>
      <Container maxW="7xl">
        <Box mb={8}>
          <Heading as="h1" size="2xl" color="gray.50" mb={2}>
            Vocabulary Library
          </Heading>
          <Text fontSize="lg" color="gray.400" mb={6}>
            Explore and master essential IELTS vocabulary
          </Text>

          <HStack spacing={4} overflowX="auto" pb={2}>
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
        </Box>

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} height="220px" borderRadius="md" />
            ))}
          </SimpleGrid>
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

        <HStack justify="center" mt={10} spacing={4}>
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            isDisabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <Text color="gray.400">
            Page {page} of {totalPages}
          </Text>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            isDisabled={page === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </HStack>

        <WordDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          word={selectedWord}
        />
      </Container>
    </Box>
  );
}
