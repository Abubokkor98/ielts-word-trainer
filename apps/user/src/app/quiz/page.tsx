'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
import { useQuizStore } from '@ielts/shared';
import { Button } from '@ielts/ui';
import { useAuthStore } from '@ielts/auth';
import { useRouter } from 'next/navigation';
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
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('mixed');
  const [questionAnswers, setQuestionAnswers] = useState<
    Map<number, { selected: string; correct: string; isCorrect: boolean }>
  >(new Map());
  const toast = useToast();
  const queryClient = useQueryClient();
  const { setLastQuizResult } = useQuizStore();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // Redirect admins to dashboard - quiz is for regular users only
  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const { refetch: fetchQuiz, isLoading: loading } = useQuery({
    queryKey: ['quiz', 'generate', selectedDifficulty],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '10' });
      if (selectedDifficulty && selectedDifficulty !== 'mixed') {
        params.append('difficulty', selectedDifficulty);
      }
      const { data } = await axiosInstance.get(`/quiz/generate?${params}`);
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
    // Check if user is authenticated before starting quiz
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to take quizzes and track your progress',
        status: 'info',
        duration: 3000,
      });
      router.push('/login');
      return;
    }

    try {
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
    } catch (error: any) {
      console.error('Error generating quiz:', error);

      // Handle insufficient words error
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes('Not enough words')
      ) {
        const difficultyName =
          selectedDifficulty === 'mixed'
            ? 'Mixed'
            : selectedDifficulty.charAt(0).toUpperCase() +
              selectedDifficulty.slice(1);

        toast({
          title: 'Not Enough Words',
          description: `There aren't enough ${difficultyName} level words in the database yet. Try selecting "Mixed (All Levels)" for now!`,
          status: 'warning',
          duration: 6000,
          isClosable: true,
        });

        // Auto-switch to mixed if not already selected
        if (selectedDifficulty !== 'mixed') {
          setSelectedDifficulty('mixed');
        }
      } else {
        // Generic error
        toast({
          title: 'Failed to Generate Quiz',
          description: error.response?.data?.message || 'Please try again',
          status: 'error',
          duration: 4000,
        });
      }
    }
  };

  const submitAnswer = async (optionId: string) => {
    setSelectedAnswer(optionId);
    const currentQuestion = questions[currentIdx];
    const isCorrect = currentQuestion.correctAnswer === optionId;

    // Find the selected option text and correct option text
    const selectedOptionText =
      currentQuestion.options.find((opt) => opt.id === optionId)?.text || '';
    const correctOptionText =
      currentQuestion.options.find(
        (opt) => opt.id === currentQuestion.correctAnswer
      )?.text || '';

    // Store answer with text instead of IDs
    const newAnswers = new Map(questionAnswers);
    newAnswers.set(currentIdx, {
      selected: selectedOptionText,
      correct: correctOptionText,
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
    // Derive the final score from recorded answers to avoid stale state
    const correctCount = Array.from(answers.values()).filter(
      (answer) => answer.isCorrect
    ).length;

    // Sync state used by the UI with the derived score
    setScore(correctCount);
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
      score: correctCount,
      totalQuestions: questions.length,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalTimeSpent,
      difficulty: selectedDifficulty,
    };

    // Store in Zustand
    setLastQuizResult({
      score: correctCount,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      difficulty: selectedDifficulty,
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
            <Box w="full" maxW="md">
              <Text color="gray.300" fontWeight="600" mb={2}>
                Select Difficulty Level
              </Text>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#2D3748',
                  borderColor: '#4A5568',
                  color: '#F7FAFC',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              >
                <option value="mixed" style={{ background: '#1A202C' }}>
                  Mixed (All Levels)
                </option>
                <option value="beginner" style={{ background: '#1A202C' }}>
                  Beginner
                </option>
                <option value="intermediate" style={{ background: '#1A202C' }}>
                  Intermediate
                </option>
                <option value="advanced" style={{ background: '#1A202C' }}>
                  Advanced
                </option>
              </select>
            </Box>
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
      <Box minH="100vh" bg="gray.900" py={8}>
        <Container maxW="6xl">
          <VStack spacing={8} align="stretch">
            {/* Top: Score Card (Home Page Style) */}
            <HStack justify="center" w="full">
              <Box
                bg="gray.800"
                p={8}
                borderRadius="lg"
                textAlign="center"
                transition="all 0.3s ease"
                borderWidth="2px"
                borderColor="transparent"
                maxW="md"
                _hover={{
                  transform: 'translateY(-8px)',
                  bg: 'gray.750',
                  borderColor: 'brand.400',
                  boxShadow: '0 10px 30px rgba(30, 136, 229, 0.3)',
                }}
              >
                <VStack spacing={6}>
                  <Text fontSize="5xl">{percentage >= 70 ? '🎉' : '📚'}</Text>
                  <Heading as="h2" fontSize="3xl" color="gray.50">
                    Quiz Complete!
                  </Heading>
                  <VStack spacing={3}>
                    <Text fontSize="xl" fontWeight="600" color="gray.300">
                      Your Score: {score}/{questions.length}
                    </Text>
                    <Badge
                      fontSize="2xl"
                      px={6}
                      py={2}
                      colorScheme={percentage >= 70 ? 'green' : 'orange'}
                    >
                      {percentage}%
                    </Badge>
                  </VStack>
                  <Text fontSize="md" color="gray.400" maxW="sm">
                    {percentage >= 70
                      ? 'Excellent work! You have a strong vocabulary!'
                      : 'Keep practicing! Review the words and try again.'}
                  </Text>
                  <Button size="lg" onClick={startQuiz} px={10} py={6} mt={4}>
                    Take Another Quiz
                  </Button>
                </VStack>
              </Box>
            </HStack>

            {/* Bottom: Q&A List in 5 columns */}
            <Box>
              <Heading as="h3" size="md" color="gray.50" mb={6}>
                📝 Answer Review
              </Heading>
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 5 }}
                spacing={6}
                rowGap={6}
              >
                {questions.map((question, idx) => {
                  const userAnswer = questionAnswers.get(idx);
                  const isCorrect = userAnswer?.isCorrect || false;

                  return (
                    <VStack key={idx} align="stretch" spacing={2}>
                      {/* Q# and Status */}
                      <HStack spacing={2}>
                        <Text fontSize="sm" fontWeight="700" color="gray.200">
                          Q{idx + 1}
                        </Text>
                        <Text
                          fontSize="lg"
                          color={isCorrect ? 'green.400' : 'red.400'}
                        >
                          {isCorrect ? '✓' : '✗'}
                        </Text>
                      </HStack>

                      {/* Question */}
                      <Text fontSize="sm" color="gray.300">
                        {question.question}
                      </Text>

                      {/* Your Answer */}
                      <Box>
                        <Text fontSize="xs" color="gray.500">
                          You:
                        </Text>
                        <Text
                          fontSize="xs"
                          color={isCorrect ? 'green.400' : 'red.400'}
                          fontWeight="600"
                        >
                          {userAnswer?.selected}
                        </Text>
                      </Box>

                      {/* Correct Answer (if wrong) */}
                      {!isCorrect && (
                        <Box>
                          <Text fontSize="xs" color="gray.500">
                            Correct:
                          </Text>
                          <Text
                            fontSize="xs"
                            color="green.400"
                            fontWeight="600"
                          >
                            {userAnswer?.correct}
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  );
                })}
              </SimpleGrid>
            </Box>
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
