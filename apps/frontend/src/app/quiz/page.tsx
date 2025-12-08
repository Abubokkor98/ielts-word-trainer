'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { useQuizStore } from '../../store/quiz.store';
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
  wordId?: string;
}

interface QuizAttempt {
  questions: Array<{
    wordId: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  score: number;
  totalQuestions: number;
  startTime: string;
  endTime: string;
  totalTimeSpent: number;
  difficulty?: string;
  topic?: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<
    Map<number, { selected: string; correct: string; isCorrect: boolean }>
  >(new Map());
  const toast = useToast();
  const queryClient = useQueryClient();
  const { setLastQuizResult } = useQuizStore();

  const { refetch: fetchQuiz, isLoading: loading } = useQuery({
    queryKey: ['quiz', 'generate'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/quiz/generate?limit=10');
      return data.data;
    },
    enabled: false,
  });

  const saveAttemptMutation = useMutation({
    mutationFn: async (attemptData: QuizAttempt) => {
      const { data } = await axiosInstance.post('/quiz/attempts', attemptData);
      return data;
    },
    onSuccess: (data) => {
      const xpEarned = data.data?.xpEarned || 0;
      toast({
        title: 'Quiz saved!',
        description: `You earned ${xpEarned} XP!`,
        status: 'success',
        duration: 4000,
      });

      // Invalidate analytics and user queries
      queryClient.invalidateQueries({ queryKey: ['analytics', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
    onError: (error: any) => {
      console.error('Failed to save quiz attempt:', error);
      toast({
        title: 'Failed to save quiz',
        description: "Your progress couldn't be saved.",
        status: 'warning',
        duration: 3000,
      });
    },
  });

  const startQuiz = async () => {
    const result = await fetchQuiz();
    if (result.data) {
      setQuestions(result.data);
      setCurrentIdx(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
      setStartTime(new Date());
      setQuestionAnswers(new Map());
    }
  };

  const submitAnswer = async (optionId: string) => {
    setSelectedAnswer(optionId);
    const currentQuestion = questions[currentIdx];
    const isCorrect = currentQuestion.correctAnswer === optionId;

    // Store answer
    const newAnswers = new Map(questionAnswers);
    newAnswers.set(currentIdx, {
      selected: optionId,
      correct: currentQuestion.correctAnswer!,
      isCorrect,
    });
    setQuestionAnswers(newAnswers);

    if (isCorrect) {
      setScore((s) => s + 1);
      toast({
        title: 'Correct!',
        status: 'success',
        duration: 1500,
      });
    } else {
      toast({
        title: 'Incorrect',
        status: 'error',
        duration: 1500,
      });
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx((i) => i + 1);
        setSelectedAnswer(null);
      } else {
        finishQuiz(newAnswers);
      }
    }, 1500);
  };

  const finishQuiz = async (answers: Map<number, any>) => {
    setShowResult(true);

    if (!startTime) return;

    const endTime = new Date();
    const totalTimeSpent = endTime.getTime() - startTime.getTime();

    // Prepare quiz attempt data
    const attemptData: QuizAttempt = {
      questions: Array.from(answers.entries()).map(([idx, answer]) => ({
        wordId: questions[idx].id, // This is the word ID from backend
        selectedAnswer: answer.selected,
        correctAnswer: answer.correct,
        isCorrect: answer.isCorrect,
        timeSpent: 0, // Can be calculated per question if needed
      })),
      score,
      totalQuestions: questions.length,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalTimeSpent,
    };

    // Store in Zustand
    setLastQuizResult({
      score,
      totalQuestions: questions.length,
      correctAnswers: score,
      difficulty: 'mixed',
      timestamp: new Date().toISOString(),
    });

    // Save to backend
    saveAttemptMutation.mutate(attemptData);
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
            {saveAttemptMutation.isPending && (
              <Text fontSize="sm" color="gray.500">
                Saving your progress...
              </Text>
            )}
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
          <Box w="full">
            <HStack justify="space-between" mb={2}>
              <Text color="gray.400" fontSize="sm">
                Question {currentIdx + 1}/{questions.length}
              </Text>
              <Badge colorScheme="brand">{Math.round(progress)}%</Badge>
            </HStack>
            <Progress
              value={progress}
              colorScheme="brand"
              size="sm"
              borderRadius="full"
            />
          </Box>

          <Box
            w="full"
            bg="gray.800"
            p={8}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <Heading as="h3" size="lg" color="gray.50" mb={6}>
              {currentQuestion.question}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.id}
                  size="lg"
                  variant={selectedAnswer === option.id ? 'default' : 'outline'}
                  onClick={() => submitAnswer(option.id)}
                  isDisabled={selectedAnswer !== null}
                  w="full"
                  py={8}
                  textAlign="left"
                  justifyContent="flex-start"
                >
                  {option.text}
                </Button>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
