'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  useToast,
  Badge,
  Divider,
  SimpleGrid,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { axiosInstance } from '@ielts/auth';

interface Word {
  _id: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic?: {
    name: string;
  };
}

export default function ReviewPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const fetchDueWords = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get('/srs/due');

      console.log('SRS Due Words Response:', data);

      if (data.success && data.data.length > 0) {
        console.log('First word data:', data.data[0]);
        setWords(data.data);
      } else {
        setSessionComplete(true);
      }
    } catch (error) {
      console.error('Error fetching due words:', error);
      toast({
        title: 'Failed to load due words',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDueWords();
  }, [fetchDueWords]);

  const handleRating = useCallback(
    async (quality: number) => {
      try {
        const word = words[currentIndex];
        await axiosInstance.post('/srs/review', {
          wordId: word._id,
          quality,
        });

        setReviewedCount((prev) => prev + 1);

        // Invalidate SRS stats cache to update navbar/dashboard badge counts
        queryClient.invalidateQueries({ queryKey: ['srs', 'stats'] });

        if (currentIndex + 1 < words.length) {
          setCurrentIndex((prev) => prev + 1);
          setIsFlipped(false);
        } else {
          setSessionComplete(true);
        }
      } catch (error) {
        toast({
          title: 'Failed to submit review',
          status: 'error',
          duration: 3000,
        });
      }
    },
    [words, currentIndex, queryClient, toast]
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (sessionComplete) return;

      if (e.key === ' ' && !isFlipped) {
        e.preventDefault();
        setIsFlipped(true);
      } else if (isFlipped) {
        switch (e.key) {
          case '1':
            handleRating(0);
            break;
          case '2':
            handleRating(3);
            break;
          case '3':
            handleRating(4);
            break;
          case '4':
            handleRating(5);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, sessionComplete, currentIndex, handleRating]);

  const handleRestart = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <Box
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex="1"
      >
        <VStack spacing={4}>
          <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
          <Text color="gray.400">Loading your review session...</Text>
        </VStack>
      </Box>
    );
  }

  if (sessionComplete) {
    return (
      <Box bg="gray.900" py={8} px={4}>
        <Container maxW="800px">
          <VStack spacing={6}>
            <Card
              bg="gray.800"
              borderColor="gray.700"
              borderWidth="1px"
              w="full"
            >
              <CardBody>
                <VStack spacing={6} textAlign="center" py={8}>
                  <Box fontSize="6xl">{reviewedCount === 0 ? '📚' : '🎉'}</Box>
                  <Heading size="xl" color="gray.50">
                    {reviewedCount === 0
                      ? 'All Caught Up!'
                      : 'Review Complete!'}
                  </Heading>
                  <Text color="gray.400" fontSize="lg">
                    {reviewedCount === 0
                      ? "You don't have any words due for review right now. Come back tomorrow after taking some quizzes!"
                      : `Excellent work! You reviewed ${reviewedCount} word${
                          reviewedCount > 1 ? 's' : ''
                        } today.`}
                  </Text>
                  <Divider borderColor="gray.700" />
                  <HStack spacing={4} pt={4}>
                    <Button
                      colorScheme="brand"
                      size="lg"
                      onClick={handleRestart}
                      leftIcon={<ArrowLeft size={20} />}
                    >
                      Back to Dashboard
                    </Button>
                    {reviewedCount > 0 && (
                      <Button
                        variant="outline"
                        colorScheme="brand"
                        size="lg"
                        onClick={fetchDueWords}
                        leftIcon={<RotateCcw size={20} />}
                      >
                        Review More
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    );
  }

  const currentWord = words[currentIndex];

  if (!currentWord) {
    return (
      <Box
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex="1"
      >
        <Text color="gray.400">Loading word data...</Text>
      </Box>
    );
  }

  const progress = ((currentIndex + 1) / words.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'green';
      case 'intermediate':
        return 'yellow';
      case 'advanced':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box bg="gray.900" py={8} px={4}>
      <Container maxW="900px">
        <VStack spacing={6}>
          {/* Header with Progress */}
          <Card bg="gray.800" borderColor="gray.700" borderWidth="1px" w="full">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Button
                    variant="ghost"
                    colorScheme="brand"
                    leftIcon={<ArrowLeft size={20} />}
                    onClick={handleRestart}
                  >
                    Dashboard
                  </Button>
                  <VStack spacing={0}>
                    <Text fontWeight="semibold" color="gray.50" fontSize="lg">
                      Card {currentIndex + 1} of {words.length}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      {reviewedCount} reviewed
                    </Text>
                  </VStack>
                  <Box w="100px" /> {/* Spacer */}
                </HStack>
                <Progress
                  value={progress}
                  colorScheme="brand"
                  size="sm"
                  borderRadius="full"
                  bg="gray.700"
                />
              </VStack>
            </CardBody>
          </Card>

          {/* Flashcard */}
          <Card
            bg="gray.800"
            borderColor={isFlipped ? 'brand.500' : 'gray.700'}
            borderWidth="2px"
            w="full"
            minH="450px"
            cursor={!isFlipped ? 'pointer' : 'default'}
            onClick={() => !isFlipped && setIsFlipped(true)}
            transition="all 0.3s"
            _hover={{
              transform: !isFlipped ? 'translateY(-4px)' : 'none',
              borderColor: !isFlipped ? 'brand.400' : 'brand.500',
            }}
          >
            <CardHeader>
              <HStack justify="space-between">
                <Badge
                  colorScheme={getDifficultyColor(currentWord.difficulty)}
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {currentWord.difficulty}
                </Badge>
                {currentWord.topic && (
                  <Text fontSize="sm" color="gray.400">
                    {currentWord.topic.name}
                  </Text>
                )}
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={8} justify="center" minH="320px" px={4}>
                {!isFlipped ? (
                  <VStack spacing={6}>
                    <Heading size="3xl" textAlign="center" color="brand.400">
                      {currentWord.word}
                    </Heading>
                    <VStack spacing={2}>
                      <Text color="gray.500" fontSize="md">
                        Click anywhere or press
                      </Text>
                      <Box
                        px={4}
                        py={2}
                        bg="gray.700"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.600"
                      >
                        <Text color="gray.400" fontWeight="bold">
                          SPACE
                        </Text>
                      </Box>
                      <Text color="gray.500" fontSize="md">
                        to reveal answer
                      </Text>
                    </VStack>
                  </VStack>
                ) : (
                  <VStack spacing={6} w="full" align="stretch">
                    <Heading size="2xl" color="brand.400" textAlign="center">
                      {currentWord.word}
                    </Heading>
                    <Divider borderColor="gray.700" />
                    <Box>
                      <Text
                        fontWeight="bold"
                        mb={2}
                        color="gray.400"
                        fontSize="sm"
                        textTransform="uppercase"
                      >
                        Definition
                      </Text>
                      <Text fontSize="xl" color="gray.50" lineHeight="tall">
                        {currentWord.meaning}
                      </Text>
                    </Box>
                    {currentWord.exampleSentence && (
                      <Box>
                        <Text
                          fontWeight="bold"
                          mb={2}
                          color="gray.400"
                          fontSize="sm"
                          textTransform="uppercase"
                        >
                          Example
                        </Text>
                        <Text
                          fontSize="lg"
                          fontStyle="italic"
                          color="gray.300"
                          lineHeight="tall"
                        >
                          "{currentWord.exampleSentence}"
                        </Text>
                      </Box>
                    )}

                    {/* Synonyms & Antonyms */}
                    {((currentWord.synonyms &&
                      currentWord.synonyms.length > 0) ||
                      (currentWord.antonyms &&
                        currentWord.antonyms.length > 0)) && (
                      <SimpleGrid columns={2} spacing={4} mt={2}>
                        {/* Synonyms */}
                        {currentWord.synonyms &&
                          currentWord.synonyms.length > 0 && (
                            <Box>
                              <Text
                                fontWeight="bold"
                                mb={2}
                                color="gray.400"
                                fontSize="sm"
                                textTransform="uppercase"
                              >
                                Synonyms
                              </Text>
                              <Wrap spacing={1.5}>
                                {currentWord.synonyms.map((syn, idx) => (
                                  <WrapItem key={idx}>
                                    <Badge
                                      colorScheme="green"
                                      fontSize="xs"
                                      px={2}
                                      py={0.5}
                                    >
                                      {syn}
                                    </Badge>
                                  </WrapItem>
                                ))}
                              </Wrap>
                            </Box>
                          )}

                        {/* Antonyms */}
                        {currentWord.antonyms &&
                          currentWord.antonyms.length > 0 && (
                            <Box>
                              <Text
                                fontWeight="bold"
                                mb={2}
                                color="gray.400"
                                fontSize="sm"
                                textTransform="uppercase"
                              >
                                Antonyms
                              </Text>
                              <Wrap spacing={1.5}>
                                {currentWord.antonyms.map((ant, idx) => (
                                  <WrapItem key={idx}>
                                    <Badge
                                      colorScheme="red"
                                      fontSize="xs"
                                      px={2}
                                      py={0.5}
                                    >
                                      {ant}
                                    </Badge>
                                  </WrapItem>
                                ))}
                              </Wrap>
                            </Box>
                          )}
                      </SimpleGrid>
                    )}
                  </VStack>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Rating Buttons */}
          {isFlipped && (
            <Card
              bg="gray.800"
              borderColor="gray.700"
              borderWidth="1px"
              w="full"
            >
              <CardBody>
                <VStack spacing={4}>
                  <Text fontWeight="semibold" color="gray.300" fontSize="lg">
                    How well did you know this word?
                  </Text>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full">
                    <Button
                      colorScheme="red"
                      onClick={() => handleRating(0)}
                      size="lg"
                      h="auto"
                      py={4}
                      flexDir="column"
                    >
                      <Text fontWeight="bold" fontSize="lg">
                        Again
                      </Text>
                      <Text fontSize="xs" opacity={0.8}>
                        Press 1
                      </Text>
                      <Text fontSize="xs" opacity={0.7} mt={1}>
                        {'<1d'}
                      </Text>
                    </Button>
                    <Button
                      colorScheme="orange"
                      onClick={() => handleRating(3)}
                      size="lg"
                      h="auto"
                      py={4}
                      flexDir="column"
                    >
                      <Text fontWeight="bold" fontSize="lg">
                        Hard
                      </Text>
                      <Text fontSize="xs" opacity={0.8}>
                        Press 2
                      </Text>
                      <Text fontSize="xs" opacity={0.7} mt={1}>
                        {'~1d'}
                      </Text>
                    </Button>
                    <Button
                      colorScheme="green"
                      onClick={() => handleRating(4)}
                      size="lg"
                      h="auto"
                      py={4}
                      flexDir="column"
                    >
                      <Text fontWeight="bold" fontSize="lg">
                        Good
                      </Text>
                      <Text fontSize="xs" opacity={0.8}>
                        Press 3
                      </Text>
                      <Text fontSize="xs" opacity={0.7} mt={1}>
                        {'~3d'}
                      </Text>
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={() => handleRating(5)}
                      size="lg"
                      h="auto"
                      py={4}
                      flexDir="column"
                    >
                      <Text fontWeight="bold" fontSize="lg">
                        Easy
                      </Text>
                      <Text fontSize="xs" opacity={0.8}>
                        Press 4
                      </Text>
                      <Text fontSize="xs" opacity={0.7} mt={1}>
                        {'~7d'}
                      </Text>
                    </Button>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
