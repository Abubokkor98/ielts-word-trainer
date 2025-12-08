'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Button, Card, CardHeader, CardContent, CardFooter } from '@ielts/ui';
import { WordDetailsModal } from '../../components/WordDetailsModal';
import {
  Box,
  Badge,
  Text,
  SimpleGrid,
  useDisclosure,
  Heading,
  Container,
  HStack,
} from '@chakra-ui/react';

interface Word {
  _id: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  difficulty: string;
  partOfSpeech?: string;
  pronunciation?: string;
  synonyms?: string[];
  antonyms?: string[];
  topic?: string;
}

export default function VocabularyPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchWords();
  }, [page, difficultyFilter]);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      if (difficultyFilter !== 'all') {
        params.append('difficulty', difficultyFilter);
      }

      const { data } = await api.get(`/words?${params.toString()}`);
      if (data.success) {
        setWords(data.data.words);
        setTotalPages(data.data.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (word: Word) => {
    setSelectedWord(word);
    onOpen();
  };

  const handleDifficultyChange = (difficulty: string) => {
    setDifficultyFilter(difficulty);
    setPage(1); // Reset to page 1 when filter changes
  };

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Container maxW="7xl">
        <Box mb={8}>
          <Heading as="h1" size="2xl" color="gray.50" mb={2} fontWeight="bold">
            Vocabulary Library
          </Heading>
          <Text fontSize="lg" color="gray.400" mb={6}>
            Explore and master essential IELTS vocabulary
          </Text>

          {/* Difficulty Filter */}
          <HStack spacing={3}>
            <Text color="gray.300" fontWeight="600" fontSize="sm">
              Filter by difficulty:
            </Text>
            <HStack spacing={2}>
              <Button
                size="sm"
                variant={difficultyFilter === 'all' ? 'default' : 'outline'}
                onClick={() => handleDifficultyChange('all')}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={
                  difficultyFilter === 'beginner' ? 'default' : 'outline'
                }
                onClick={() => handleDifficultyChange('beginner')}
              >
                Beginner
              </Button>
              <Button
                size="sm"
                variant={
                  difficultyFilter === 'intermediate' ? 'default' : 'outline'
                }
                onClick={() => handleDifficultyChange('intermediate')}
              >
                Intermediate
              </Button>
              <Button
                size="sm"
                variant={
                  difficultyFilter === 'advanced' ? 'default' : 'outline'
                }
                onClick={() => handleDifficultyChange('advanced')}
              >
                Advanced
              </Button>
            </HStack>
          </HStack>
        </Box>

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
            {[...Array(8)].map((_, i) => (
              <Box
                key={i}
                h="220px"
                borderRadius="lg"
                bg="gray.800"
                borderWidth="1px"
                borderColor="gray.700"
                className="animate-pulse"
              />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
            {words.map((word) => (
              <Card key={word._id}>
                <CardHeader>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                  >
                    <Heading
                      as="h3"
                      size="md"
                      color="brand.400"
                      fontWeight="bold"
                    >
                      {word.word}
                    </Heading>
                    <Badge
                      colorScheme={
                        word.difficulty === 'beginner'
                          ? 'green'
                          : word.difficulty === 'intermediate'
                          ? 'orange'
                          : 'red'
                      }
                      fontSize="xs"
                    >
                      {word.difficulty}
                    </Badge>
                  </Box>
                </CardHeader>
                <CardContent>
                  <Box mb={3}>
                    <Text
                      fontWeight="600"
                      color="gray.300"
                      fontSize="xs"
                      mb={1}
                    >
                      MEANING
                    </Text>
                    <Text color="gray.400" fontSize="sm" noOfLines={2}>
                      {word.meaning}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      fontWeight="600"
                      color="gray.300"
                      fontSize="xs"
                      mb={1}
                    >
                      EXAMPLE
                    </Text>
                    <Text
                      fontSize="xs"
                      fontStyle="italic"
                      color="gray.500"
                      noOfLines={2}
                    >
                      "{word.exampleSentence}"
                    </Text>
                  </Box>
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

        <Box display="flex" justifyContent="center" gap={4} mt={10}>
          <Button
            isDisabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <Box
            display="flex"
            alignItems="center"
            px={5}
            py={2}
            bg="gray.800"
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.700"
            fontWeight="600"
            color="gray.300"
            fontSize="sm"
          >
            Page {page} of {totalPages}
          </Box>
          <Button
            isDisabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </Box>

        <WordDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          word={selectedWord}
        />
      </Container>
    </Box>
  );
}
