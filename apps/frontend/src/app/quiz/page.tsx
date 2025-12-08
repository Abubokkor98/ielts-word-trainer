'use client';

import { useState } from 'react';
import { api } from '../../lib/api';
import { Button } from '@ielts/ui';
import {
  Box,
  Text,
  VStack,
  HStack,
  Container,
  Progress,
  useToast,
  SimpleGrid,
  Badge,
  Heading,
} from '@chakra-ui/react';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  question: string;
  options: Option[];
  correctAnswer?: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const toast = useToast();

  const startQuiz = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/quiz/generate?limit=5');
      if (data.success) {
        setQuestions(data.data);
        setCurrentIdx(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
      }
    } catch (err: any) {
      toast({
        title: 'Error loading quiz',
        description: err.response?.data?.message || 'Failed to generate quiz',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (optionId: string) => {
    setSelectedAnswer(optionId);
    // @ts-ignore
    const isCorrect = questions[currentIdx].correctAnswer === optionId;
    if (isCorrect) {
      setScore((s) => s + 1);
      toast({
        title: 'Correct!',
        status: 'success',
        duration: 1500,
        isClosable: true,
        position: 'top',
      });
    } else {
      toast({
        title: 'Incorrect',
        description: 'Keep trying!',
        status: 'error',
        duration: 1500,
        isClosable: true,
        position: 'top',
      });
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx((i) => i + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (questions.length === 0) {
    return (
      <Box
        minH="100vh"
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={12}
      >
        <Container maxW="2xl">
          <VStack
            spacing={8}
            bg="gray.800"
            p={12}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <Text fontSize="6xl">🎯</Text>
            <Heading as="h1" fontSize="3xl" color="gray.50" textAlign="center">
              Ready to Test Your Vocabulary?
            </Heading>
            <Text fontSize="lg" color="gray.400" textAlign="center" maxW="md">
              Challenge yourself with our interactive quiz featuring carefully
              selected IELTS vocabulary
            </Text>
            <Button
              size="lg"
              onClick={startQuiz}
              isLoading={loading}
              loadingText="Loading questions..."
              px={12}
              py={6}
            >
              Start New Quiz
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Box
        minH="100vh"
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={12}
      >
        <Container maxW="2xl">
          <VStack
            spacing={8}
            bg="gray.800"
            p={12}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={percentage >= 70 ? 'success.500' : 'warning.500'}
          >
            <Text fontSize="6xl">{percentage >= 70 ? '🎉' : '📚'}</Text>
            <Heading as="h2" fontSize="4xl" color="gray.50">
              Quiz Complete!
            </Heading>
            <VStack spacing={4}>
              <Text fontSize="2xl" fontWeight="600" color="gray.300">
                Your Score: {score}/{questions.length}
              </Text>
              <Badge
                fontSize="xl"
                px={6}
                py={2}
                colorScheme={percentage >= 70 ? 'green' : 'orange'}
              >
                {percentage}%
              </Badge>
            </VStack>
            <Text fontSize="md" color="gray.400" textAlign="center" maxW="md">
              {percentage >= 70
                ? 'Excellent work! You have a strong vocabulary!'
                : 'Keep practicing! Review the words and try again.'}
            </Text>
            <Button size="lg" onClick={startQuiz} px={10} py={6}>
              Take Another Quiz
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <Box minH="100vh" bg="gray.900" py={12}>
      <Container maxW="4xl">
        <VStack spacing={8}>
          {/* Progress Bar */}
          <Box w="full">
            <HStack justify="space-between" mb={3}>
              <Text fontWeight="600" color="gray.300">
                Question {currentIdx + 1} of {questions.length}
              </Text>
              <Badge colorScheme="blue" fontSize="sm">
                Score: {score}/{currentIdx}
              </Badge>
            </HStack>
            <Progress
              value={progress}
              size="md"
              borderRadius="full"
              colorScheme="brand"
            />
          </Box>

          {/* Question Card */}
          <Box
            w="full"
            bg="gray.800"
            p={10}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <VStack spacing={8} align="stretch">
              <Text
                fontSize="2xl"
                fontWeight="600"
                color="gray.50"
                textAlign="center"
              >
                {currentQuestion.question}
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={option.id}
                    onClick={() => !selectedAnswer && submitAnswer(option.id)}
                    isDisabled={selectedAnswer !== null}
                    h="auto"
                    py={5}
                    px={5}
                    fontSize="md"
                    whiteSpace="normal"
                    textAlign="left"
                    justifyContent="flex-start"
                    variant="outline"
                    borderColor={
                      selectedAnswer === option.id
                        ? // @ts-ignore
                          currentQuestion.correctAnswer === option.id
                          ? 'success.500'
                          : 'error.500'
                        : 'gray.600'
                    }
                    bg={
                      selectedAnswer === option.id
                        ? // @ts-ignore
                          currentQuestion.correctAnswer === option.id
                          ? 'whiteAlpha.100'
                          : 'whiteAlpha.50'
                        : 'transparent'
                    }
                    _hover={{
                      bg: selectedAnswer ? undefined : 'whiteAlpha.100',
                    }}
                  >
                    <HStack spacing={3} w="full">
                      <Box
                        minW="32px"
                        h="32px"
                        borderRadius="full"
                        bg="brand.600"
                        color="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="600"
                      >
                        {String.fromCharCode(65 + index)}
                      </Box>
                      <Text flex={1} color="gray.200">
                        {option.text}
                      </Text>
                    </HStack>
                  </Button>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
