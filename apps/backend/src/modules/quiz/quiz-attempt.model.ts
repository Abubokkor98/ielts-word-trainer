import mongoose, { Schema, Document } from 'mongoose';
import { QuestionType } from '@ielts/shared';

export interface IQuizAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  topic?: string;
  difficulty?: string;
  questions: Array<{
    wordId: mongoose.Types.ObjectId;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number; // milliseconds
    questionType?: QuestionType;
    qualityRating?: number; // 0-5 SM-2 rating
  }>;
  score: number;
  totalQuestions: number;
  startTime: Date;
  endTime: Date;
  totalTimeSpent: number; // milliseconds
  createdAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: { type: String },
    difficulty: { type: String },
    questions: [
      {
        wordId: { type: Schema.Types.ObjectId, ref: 'Word', required: true },
        selectedAnswer: { type: String, required: true },
        correctAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        timeSpent: { type: Number, default: 0 },
        questionType: { type: String },
        qualityRating: { type: Number },
      },
    ],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalTimeSpent: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for getUserAttempts (filter by userId, sort by createdAt descending)
QuizAttemptSchema.index({ userId: 1, createdAt: -1 });

export const QuizAttempt = mongoose.model<IQuizAttempt>(
  'QuizAttempt',
  QuizAttemptSchema
);
