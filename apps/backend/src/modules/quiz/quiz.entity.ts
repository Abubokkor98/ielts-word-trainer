import { Difficulty } from '@ielts/shared';
import mongoose, { type Document, Schema } from 'mongoose';

export interface IQuiz extends Document {
  title: string;
  description?: string;
  topic?: string;
  difficulty: Difficulty;
  questions: Array<{
    wordId: mongoose.Types.ObjectId;
    questionText: string;
    options: string[];
    correctAnswer: string;
  }>;
  duration: number; // in minutes
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String },
    topic: { type: String },
    difficulty: {
      type: String,
      enum: Object.values(Difficulty),
      default: Difficulty.INTERMEDIATE,
    },
    questions: [
      {
        wordId: { type: Schema.Types.ObjectId, ref: 'Word', required: true },
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
      },
    ],
    duration: { type: Number, default: 15 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);
