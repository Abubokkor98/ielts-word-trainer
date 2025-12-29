import mongoose, { Schema, Document } from 'mongoose';
import { SRSStatus } from '@ielts/shared';

export interface ISRSItem extends Document {
  user: mongoose.Types.ObjectId;
  word: mongoose.Types.ObjectId;
  status: SRSStatus;
  interval: number; // in days
  repetition: number;
  easeFactor: number;
  quality: number;
  lapseCount: number;
  nextReviewDate: Date;
  lastReviewed: Date;
}

const SRSItemSchema = new Schema<ISRSItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    word: { type: Schema.Types.ObjectId, ref: 'Word', required: true },
    status: {
      type: String,
      enum: Object.values(SRSStatus),
      default: SRSStatus.LEARNING,
    },
    interval: { type: Number, default: 0 },
    repetition: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    quality: { type: Number, default: 0 }, // Last review quality
    lapseCount: { type: Number, default: 0 }, // How many times forgotten
    nextReviewDate: { type: Date, default: Date.now, index: true },
    lastReviewed: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index for unique word per user
SRSItemSchema.index({ user: 1, word: 1 }, { unique: true });

export const SRSItem = mongoose.model<ISRSItem>('SRSItem', SRSItemSchema);
