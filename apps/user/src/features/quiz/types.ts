import type { QuestionType } from '@ielts/shared';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
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

export interface QuizAttempt {
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

export interface QuizRecommendation {
  type: string;
  reason: string;
}

export interface QuestionAnswer {
  selected: string;
  correct: string;
  isCorrect: boolean;
  rating?: number;
  timeSpentMs?: number;
}
