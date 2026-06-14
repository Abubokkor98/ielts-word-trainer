import { useToast } from '@ielts/ui';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@ielts/auth';
import { quizApi } from '../services/quiz.api';
import { isQuizLimitError } from '../utils';
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
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [hasCompletedQuizToday, setHasCompletedQuizToday] = useState(false);
  const isEmailVerified = useAuthStore((state) => state.user?.isEmailVerified ?? false);

  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Hydrate client-side guard from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('hasCompletedQuizToday') === 'true') {
        setHasCompletedQuizToday(true);
      }
    }
  }, []);

  const { mutateAsync: generateQuizMutation, isPending: isLoadingQuiz } = useMutation({
    mutationFn: () => quizApi.generateQuiz(selectedDifficulty),
  });

  const startQuiz = async () => {
    if (!isAuthenticated) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Client-side guard: if unverified and already completed a quiz this session, block immediately
    if (!isEmailVerified && hasCompletedQuizToday) {
      setIsLimitModalOpen(true);
      return;
    }

    try {
      const data = await generateQuizMutation();
      setQuestions(data);
      setCurrentIdx(0);
      setShowResult(false);
      setSelectedAnswer(null);
      setStartTime(new Date());
      setQuestionStartTime(new Date());
      setQuestionAnswers(new Map());
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      
      if (isQuizLimitError(error)) {
        setIsLimitModalOpen(true);
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes('Not enough words')
      ) {
        toast({
          title: 'Not Enough Words',
          description: 'You need to learn more vocabulary before taking a quiz.',
        });
      } else {
        toast({
          title: 'Failed to Generate Quiz',
          description: error.response?.data?.message || 'Please try again',
          variant: 'destructive',
        });
      }
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

    const correctOptionText =
      currentQuestion.options.find((opt) => opt.id === currentQuestion.correctAnswer)?.text || '';

    // We rely on the inline UI for correct/incorrect feedback instead of toasts.

    const timeSpentMs = questionStartTime ? Date.now() - questionStartTime.getTime() : 0;

    const selectedOptionText =
      currentQuestion.options.find((opt) => opt.id === optionId)?.text || '';

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
      if (!isEmailVerified) {
        setHasCompletedQuizToday(true);
        sessionStorage.setItem('hasCompletedQuizToday', 'true');
      }
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
    isLimitModalOpen,
    setIsLimitModalOpen,
  };
}
