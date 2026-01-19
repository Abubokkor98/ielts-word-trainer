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

TopicSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate() as Record<string, any>;
  if (update?.name && typeof update.name === 'string') {
    update.slug = update.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  } else if (update?.$set?.name && typeof update.$set.name === 'string') {
    update.$set.slug = update.$set.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
});

export const Topic = mongoose.model<ITopic>('Topic', TopicSchema);
