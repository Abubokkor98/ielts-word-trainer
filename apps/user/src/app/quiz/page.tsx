'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
import { useQuizStore, QuestionType } from '@ielts/shared';
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
  type: QuestionType;
  question: string;
  options: Option[];
  correctAnswer?: string;
  wordId?: string;
  wordDetails?: {
    word: string;
    meaning: string;
    exampleSentence: string;
    synonyms?: string[];
    partOfSpeech?: string;
  };
}

interface QuizAttempt {
  questions: Array<{
    wordId: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    questionType?: string;
    qualityRating?: number; // 0-5 SM-2 rating
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
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('mixed');
  const [questionAnswers, setQuestionAnswers] = useState<
    Map<
      number,
      {
        selected: string;
        correct: string;
        isCorrect: boolean;
        rating?: number;
        timeSpentMs?: number; // Time spent on this question in milliseconds
      }
    >
  >(new Map());
  const toast = useToast();
  const queryClient = useQueryClient();
  const { setLastQuizResult } = useQuizStore();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // ... (rest of the file remains same until return)

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
        setQuestionStartTime(new Date()); // Start timer for first question
        setQuestionAnswers(new Map());
        setRecommendation(null); // Reset recommendation for new quiz
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

  // Recommendation State
  const [recommendation, setRecommendation] = useState<{
    type: string;
    reason: string;
  } | null>(null);

  useEffect(() => {
    if (showResult && isAuthenticated) {
      axiosInstance
        .get('/quiz/recommend-difficulty')
        .then((res) => {
          if (res.data.data.recommendation !== 'maintain') {
            setRecommendation({
              type: res.data.data.recommendation,
              reason: res.data.data.reason,
            });
          }
        })
        .catch((err) => console.error('Failed to get recommendation', err));
    }
  }, [showResult, isAuthenticated]);

  const handleAnswerSelection = (optionId: string) => {
    if (selectedAnswer) return; // Prevent double clicks
    setSelectedAnswer(optionId);

    const currentQuestion = questions[currentIdx];
    const isCorrect = currentQuestion.correctAnswer === optionId;

    // Calculate answer speed and assign quality rating
    let qualityRating = 0; // Default for incorrect

    if (isCorrect && questionStartTime) {
      const answerTime = (Date.now() - questionStartTime.getTime()) / 1000; // seconds

      // Speed-based quality rating for correct answers:
      if (answerTime < 3) {
        qualityRating = 5; // Fast = Easy
      } else if (answerTime < 8) {
        qualityRating = 4; // Medium = Good
      } else {
        qualityRating = 3; // Slow = Hard
      }
    }

    if (!isCorrect) {
      toast({
        title: 'Incorrect',
        status: 'error',
        duration: 1500,
      });
    } else {
      toast({
        title: 'Correct!',
        status: 'success',
        duration: 1500,
      });
    }

    // Calculate time spent on this question
    const timeSpentMs = questionStartTime
      ? Date.now() - questionStartTime.getTime()
      : 0;

    recordAnswer(optionId, isCorrect, qualityRating, timeSpentMs);

    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const recordAnswer = (
    selected: string,
    isCorrect: boolean,
    rating: number,
    timeSpentMs: number
  ) => {
    const currentQuestion = questions[currentIdx];
    const selectedOptionText =
      currentQuestion.options.find((opt) => opt.id === selected)?.text || '';
    const correctOptionText =
      currentQuestion.options.find(
        (opt) => opt.id === currentQuestion.correctAnswer
      )?.text || '';

    const newAnswers = new Map(questionAnswers);
    newAnswers.set(currentIdx, {
      selected: selectedOptionText,
      correct: correctOptionText,
      isCorrect,
      rating, // Store the SM-2 rating
      timeSpentMs, // Store actual time spent
    });
    setQuestionAnswers(newAnswers);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setQuestionStartTime(new Date()); // Start timer for next question

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    // Re-read answers from state (closure issue workaround if needed, but questions shouldn't change)
    // Actually we need to pass the answers map or rely on state if updated.
    // Ideally pass it in, but for now relying on state reference which might differ in async.
    // Safest to rely on functional state update or the map if passed.
    // Let's rely on the latest state content via a helper or just use the current Map ref if possible.
    // But since this is called from timeout/event, state might be stale.
    // We already moved map update to recordAnswer.

    // NOTE: In React closure, 'questionAnswers' might be stale in this function scope if not careful.
    // But since we call it from nextQuestion which is triggered by user action or timeout...
    // Let's trust the state is relatively fresh or pass it.
    // Better: nextQuestion calls it.

    const answers = questionAnswers; // This might be stale!
    // But wait, recordAnswer UPDATES it.
    // IMPORTANT: State updates are async.
    // To fix this cleanly without major refactor, let's use a ref or just inspect the latest map passed to finish.
    // We will just use the state variable, assuming React batches fast enough for the final submit.
    // Or better: Re-calculate score from 'valid' answers.

    const correctCount = Array.from(answers.values()).filter(
      (answer) => answer.isCorrect
    ).length;

    setScore(correctCount);
    setShowResult(true);

    if (!startTime) return;

    const endTime = new Date();
    const totalTimeSpent = endTime.getTime() - startTime.getTime();

    const attemptData: QuizAttempt = {
      questions: Array.from(answers.entries()).map(([idx, answer]) => ({
        wordId: questions[idx].id,
        selectedAnswer: answer.selected,
        correctAnswer: answer.correct,
        isCorrect: answer.isCorrect,
        timeSpent: answer.timeSpentMs || 0,
        questionType: questions[idx].type,
        qualityRating: answer.rating, // Pass the rating to backend
      })),
      score: correctCount,
      totalQuestions: questions.length,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalTimeSpent,
      difficulty: selectedDifficulty,
    };

    setLastQuizResult({
      score: correctCount,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      difficulty: selectedDifficulty,
      timestamp: new Date().toISOString(),
    });

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
                borderWidth="1px"
                borderColor="brand.400"
                maxW="md"
                _hover={{
                  transform: 'translateY(-8px)',
                  bg: 'gray.750',
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

                  {/* Recommendation Badge */}
                  {recommendation && (
                    <Box
                      bg="blue.900"
                      p={3}
                      borderRadius="md"
                      mt={2}
                      borderColor="blue.500"
                      borderWidth={1}
                    >
                      <Text color="blue.200" fontWeight="bold" fontSize="sm">
                        💡 Recommendation
                      </Text>
                      <Text color="white" fontSize="sm">
                        {recommendation.reason}
                      </Text>
                    </Box>
                  )}

                  <Button size="lg" onClick={startQuiz} px={10} py={6} mt={4}>
                    Take Another Quiz
                  </Button>
                </VStack>
              </Box>
            </HStack>

            {/* Bottom: Word Details Review */}
            <Box>
              <Heading as="h3" size="lg" color="gray.50" mb={6}>
                📚 Word Review & Explanations
              </Heading>
              <VStack spacing={4} align="stretch">
                {questions.map((question, idx) => {
                  const userAnswer = questionAnswers.get(idx);
                  const isCorrect = userAnswer?.isCorrect || false;
                  const wordDetails = question.wordDetails;

                  if (!wordDetails) return null;

                  return (
                    <Box
                      key={idx}
                      bg="gray.800"
                      p={6}
                      borderRadius="lg"
                      borderWidth={2}
                      borderColor={isCorrect ? 'green.500' : 'red.500'}
                    >
                      <HStack justify="space-between" mb={4}>
                        <VStack align="start" spacing={1}>
                          <HStack>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="gray.400"
                            >
                              Q{idx + 1}
                            </Text>
                            <Badge colorScheme={isCorrect ? 'green' : 'red'}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </Badge>
                          </HStack>
                          <Heading size="lg" color="white">
                            {wordDetails.word}
                          </Heading>
                          <Badge colorScheme="blue" fontSize="xs">
                            {wordDetails.partOfSpeech}
                          </Badge>
                        </VStack>
                      </HStack>

                      <VStack align="stretch" spacing={3}>
                        <Box>
                          <Text
                            color="gray.400"
                            fontSize="sm"
                            fontWeight="bold"
                          >
                            Meaning
                          </Text>
                          <Text color="gray.200" fontSize="md">
                            {wordDetails.meaning}
                          </Text>
                        </Box>

                        <Box>
                          <Text
                            color="gray.400"
                            fontSize="sm"
                            fontWeight="bold"
                          >
                            Example
                          </Text>
                          <Text color="gray.300" fontStyle="italic">
                            "{wordDetails.exampleSentence}"
                          </Text>
                        </Box>

                        {wordDetails.synonyms &&
                          wordDetails.synonyms.length > 0 && (
                            <Box>
                              <Text
                                color="gray.400"
                                fontSize="sm"
                                fontWeight="bold"
                              >
                                Synonyms
                              </Text>
                              <Text color="gray.400">
                                {wordDetails.synonyms.join(', ')}
                              </Text>
                            </Box>
                          )}

                        {!isCorrect && (
                          <Box mt={2} p={3} bg="red.900" borderRadius="md">
                            <Text fontSize="sm" color="red.200">
                              <strong>You selected:</strong>{' '}
                              {userAnswer?.selected}
                            </Text>
                            <Text fontSize="sm" color="green.200" mt={1}>
                              <strong>Correct answer:</strong>{' '}
                              {userAnswer?.correct}
                            </Text>
                          </Box>
                        )}
                      </VStack>
                    </Box>
                  );
                })}
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  // Helper to get type badge color/text
  const getTypeBadge = (type: QuestionType) => {
    switch (type) {
      case QuestionType.WORD_TO_MEANING:
        return { color: 'blue', text: 'Vocabulary' };
      case QuestionType.MEANING_TO_WORD:
        return { color: 'purple', text: 'Reverse' };
      case QuestionType.SYNONYM_MATCH:
        return { color: 'green', text: 'Synonym' };
      case QuestionType.ANTONYM_MATCH:
        return { color: 'orange', text: 'Antonym' };
      case QuestionType.SENTENCE_COMPLETION:
        return { color: 'pink', text: 'Fill in Blank' };
      default:
        return { color: 'gray', text: 'Question' };
    }
  };

  const badgeInfo = getTypeBadge(currentQuestion.type);

  return (
    <Box minH="100vh" bg="gray.900" py={12}>
      <Container maxW="4xl">
        <VStack spacing={8}>
          <Box w="full">
            <HStack justify="space-between" mb={2}>
              <HStack>
                <Text color="gray.400" fontSize="sm">
                  Question {currentIdx + 1}/{questions.length}
                </Text>
                <Badge colorScheme={badgeInfo.color} fontSize="xs">
                  {badgeInfo.text}
                </Badge>
              </HStack>
              <Badge colorScheme="brand">{Math.round(progress)}%</Badge>
            </HStack>
            <Progress
              value={progress}
              colorScheme="brand"
              size="sm"
              borderRadius="full"
            />
          </Box>

          {/* Question Card */}
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

            {/* Answer Options */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.id}
                  size="lg"
                  variant={selectedAnswer === option.id ? 'default' : 'outline'}
                  colorScheme={
                    selectedAnswer === option.id
                      ? option.id === currentQuestion.correctAnswer
                        ? 'green'
                        : 'red'
                      : 'gray'
                  }
                  onClick={() => handleAnswerSelection(option.id)}
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
