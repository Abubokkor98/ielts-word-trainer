'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@ielts/auth';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quizApi } from './services/quiz.api';
import { useQuizGame } from './hooks/use-quiz-game';
import { QuizStartScreen } from './components/quiz-start-screen';
import { QuizQuestionCard } from './components/quiz-question-card';
import { QuizResults } from './components/quiz-results';
import { QuizAttempt } from './types';
import { useQuizStore } from '@ielts/shared';

export function QuizContainer() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { setLastQuizResult } = useQuizStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('mixed');

  const {
    questions,
    currentIdx,
    showResult,
    selectedAnswer,
    startQuiz,
    isLoadingQuiz,
    handleAnswerSelection,
    questionAnswers,
    startTime,
  } = useQuizGame({
    isAuthenticated,
    selectedDifficulty,
  });

  const saveAttemptMutation = useMutation({
    mutationFn: quizApi.saveAttempt,
    onSuccess: (data) => {
      const xpEarned = data.data?.xpEarned || 0;
      toast({
        title: 'Quiz saved!',
        description: `You earned ${xpEarned} XP!`,
        status: 'success',
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ['analytics', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['srs', 'stats'] });
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

  // Handle Score Calculation and Saving
  // We use a ref to ensure we only save once per quiz finish
  const hasSavedRef = useRef(false);

  // Reset saved ref when quiz starts (questions become empty or change)
  useEffect(() => {
    if (questions.length === 0) {
      hasSavedRef.current = false;
    }
  }, [questions]);

  // Derive score from answers map locally in render to be safe
  const calculatedScore = Array.from(questionAnswers.values()).filter(
    (a) => a.isCorrect
  ).length;

  useEffect(() => {
    if (
      showResult &&
      startTime &&
      !hasSavedRef.current &&
      questions.length > 0
    ) {
      hasSavedRef.current = true;

      const endTime = new Date();
      const totalTimeSpent = endTime.getTime() - startTime.getTime();

      const attemptData: QuizAttempt = {
        questions: Array.from(questionAnswers.entries()).map(
          ([idx, answer]) => ({
            wordId: questions[idx].id,
            selectedAnswer: answer.selected,
            correctAnswer: answer.correct,
            isCorrect: answer.isCorrect,
            timeSpent: answer.timeSpentMs || 0,
            questionType: questions[idx].type,
            qualityRating: answer.rating,
          })
        ),
        score: calculatedScore,
        totalQuestions: questions.length,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalTimeSpent,
        difficulty: selectedDifficulty,
      };

      setLastQuizResult({
        score: calculatedScore,
        totalQuestions: questions.length,
        correctAnswers: calculatedScore,
        difficulty: selectedDifficulty,
        timestamp: new Date().toISOString(),
      });

      saveAttemptMutation.mutate(attemptData);
    }
  }, [
    showResult,
    startTime,
    questions,
    questionAnswers,
    selectedDifficulty,
    setLastQuizResult,
    saveAttemptMutation,
    calculatedScore,
  ]);

  const handleStart = () => {
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
    startQuiz();
  };

  if (questions.length === 0 && !showResult) {
    return (
      <QuizStartScreen
        onStart={handleStart}
        isLoading={isLoadingQuiz}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
      />
    );
  }

  if (showResult) {
    return (
      <QuizResults
        score={calculatedScore}
        questions={questions}
        answers={questionAnswers}
        onRestart={handleStart}
      />
    );
  }

  return (
    <QuizQuestionCard
      question={questions[currentIdx]}
      currentIdx={currentIdx}
      totalQuestions={questions.length}
      selectedAnswer={selectedAnswer}
      onAnswer={handleAnswerSelection}
    />
  );
}
