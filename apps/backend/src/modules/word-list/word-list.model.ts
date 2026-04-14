import mongoose, { type Document, Schema } from 'mongoose';

export interface IWordList extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  words: mongoose.Types.ObjectId[];
}

const WordListSchema = new Schema<IWordList>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    words: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Word',
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

// Prevent duplicate list names per user
WordListSchema.index({ user: 1, name: 1 }, { unique: true });

export const WordList =
  mongoose.models['WordList'] ||
  mongoose.model<IWordList>('WordList', WordListSchema);
