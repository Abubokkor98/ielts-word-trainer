import { Difficulty } from '@ielts/shared';
import mongoose, { type Document, Schema } from 'mongoose';

export interface IQuizResult extends Document {
  user: mongoose.Types.ObjectId;
  score: number;
  totalQuestions: number;
  topic?: mongoose.Types.ObjectId;
  difficulty?: Difficulty;
  answers: {
    questionId?: string; // or wordId
    isCorrect: boolean;
  }[];
  date: Date;
}

const QuizResultSchema = new Schema<IQuizResult>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    topic: { type: Schema.Types.ObjectId, ref: 'Topic' },
    difficulty: { type: String, enum: Object.values(Difficulty) },
    answers: [
      {
        questionId: String,
        isCorrect: Boolean,
      },
    ],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const QuizResult = mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
