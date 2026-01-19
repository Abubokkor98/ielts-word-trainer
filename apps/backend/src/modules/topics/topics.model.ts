import mongoose, { type Document, Schema } from 'mongoose';

export interface ITopic extends Document {
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  wordCount: number;
}

const TopicSchema = new Schema<ITopic>(
  {
    name: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    thumbnail: { type: String },
    wordCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Pre-save hook to auto-generate slug from name
TopicSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
});

export const Topic = mongoose.model<ITopic>('Topic', TopicSchema);
