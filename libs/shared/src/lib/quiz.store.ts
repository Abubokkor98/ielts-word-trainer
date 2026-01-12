import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  difficulty: string;
  timestamp: string;
}

interface QuizState {
  lastQuizResult: QuizResult | null;
  setLastQuizResult: (result: QuizResult | null) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      lastQuizResult: null,
      setLastQuizResult: (result) => set({ lastQuizResult: result }),
      reset: () => set({ lastQuizResult: null }),
    }),
    {
      name: 'quiz-storage',
    }
  )
);
