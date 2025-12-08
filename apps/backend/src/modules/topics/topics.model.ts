import mongoose, { Schema, Document } from 'mongoose';

export interface ITopic extends Document {
  name: string;
  description?: string;
  thumbnail?: string;
  wordCount: number;
}

const TopicSchema = new Schema<ITopic>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    thumbnail: { type: String },
    wordCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Topic = mongoose.model<ITopic>('Topic', TopicSchema);
