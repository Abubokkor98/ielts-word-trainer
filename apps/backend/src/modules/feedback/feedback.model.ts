import mongoose, { type Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  feedbackType: 'love' | 'improve' | 'feature' | 'bug';
  rating: number;
  message: string;
  email: string;
  deviceInfo?: string;
  status: 'new' | 'reviewed' | 'resolved';
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    feedbackType: {
      type: String,
      enum: ['love', 'improve', 'feature', 'bug'],
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
    email: { type: String, required: true, index: true },
    deviceInfo: { type: String, required: false },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'resolved'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Compound index for querying a user's feedbacks sorted by creation
FeedbackSchema.index({ userId: 1, createdAt: -1 });

export const Feedback = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
