import { z } from 'zod';

export const QuizAttemptSchema = z.object({
  topic: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  questions: z.array(
    z.object({
      wordId: z.string(),
      selectedAnswer: z.string(),
      correctAnswer: z.string(),
      isCorrect: z.boolean(),
      timeSpent: z.number().min(0).optional().default(0),
    })
  ),
  score: z.number().min(0),
  totalQuestions: z.number().min(1),
  startTime: z.string().or(z.date()),
  endTime: z.string().or(z.date()),
  totalTimeSpent: z.number().min(0),
});

export type QuizAttemptInput = z.infer<typeof QuizAttemptSchema>;
