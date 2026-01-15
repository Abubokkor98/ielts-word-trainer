import { useToast } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { quizApi } from '../services/quiz.api';
import type { Question, QuestionAnswer } from '../types';

interface UseQuizGameProps {
  isAuthenticated: boolean;
  selectedDifficulty: string;
}

export function useQuizGame({ isAuthenticated, selectedDifficulty }: UseQuizGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<Map<number, QuestionAnswer>>(new Map());

  const toast = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const { refetch: fetchQuiz, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ['quiz', 'generate', selectedDifficulty],
    queryFn: () => quizApi.generateQuiz(selectedDifficulty),
    enabled: false,
    retry: false,
  });

  const startQuiz = async () => {
    if (!isAuthenticated) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const result = await fetchQuiz();

    if (result.error) {
      const error = result.error as AxiosError<{ message: string }>;
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes('Not enough words')
      ) {
        toast({
          title: 'Not Enough Words',
          description: 'You need to learn more vocabulary before taking a quiz.',
          status: 'info',
          duration: 4000,
        });
      } else {
        toast({
          title: 'Failed to Generate Quiz',
          description: error.response?.data?.message || 'Please try again',
          status: 'error',
          duration: 4000,
        });
      }
      return;
    }

    if (result.data) {
      setQuestions(result.data);
      setCurrentIdx(0);
      setShowResult(false);
      setSelectedAnswer(null);
      setStartTime(new Date());
      setQuestionStartTime(new Date());
      setQuestionAnswers(new Map());
    }
  };

  const handleAnswerSelection = (optionId: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(optionId);

    const currentQuestion = questions[currentIdx];
    const isCorrect = currentQuestion.correctAnswer === optionId;

    let qualityRating = 0;
    if (isCorrect && questionStartTime) {
      const answerTime = (Date.now() - questionStartTime.getTime()) / 1000;
      if (answerTime < 3) qualityRating = 5;
      else if (answerTime < 8) qualityRating = 4;
      else qualityRating = 3;
    }

    if (!isCorrect) {
      toast({ title: 'Incorrect', status: 'error', duration: 1500 });
    } else {
      toast({ title: 'Correct!', status: 'success', duration: 1500 });
    }

    const timeSpentMs = questionStartTime ? Date.now() - questionStartTime.getTime() : 0;

    const selectedOptionText =
      currentQuestion.options.find((opt) => opt.id === optionId)?.text || '';
    const correctOptionText =
      currentQuestion.options.find((opt) => opt.id === currentQuestion.correctAnswer)?.text || '';

    setQuestionAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(currentIdx, {
        selected: selectedOptionText,
        correct: correctOptionText,
        isCorrect,
        rating: qualityRating,
        timeSpentMs,
      });
      return newMap;
    });

    timeoutRef.current = setTimeout(nextQuestion, 1500);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setQuestionStartTime(new Date());
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      setShowResult(true);
    }
  };

  return {
    questions,
    currentIdx,
    showResult,
    selectedAnswer,
    startQuiz,
    handleAnswerSelection,
    isLoadingQuiz,
    questionAnswers,
    startTime,
  };
}
