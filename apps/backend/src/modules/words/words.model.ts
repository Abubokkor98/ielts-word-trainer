import mongoose, { type Document, Schema } from 'mongoose';

export interface IWord extends Document {
  word: string;
  meaning: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
  topic: mongoose.Types.ObjectId | string;
  partOfSpeech: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  module: 'reading' | 'writing' | 'listening' | 'speaking';
  searchableText?: string; // Auto-populated for efficient search
}

const WordSchema = new Schema<IWord>(
  {
    word: { type: String, required: true, index: true },
    meaning: { type: String, required: true },
    exampleSentence: { type: String, required: true },
    synonyms: { type: [String], required: true },
    antonyms: { type: [String], required: true },
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      index: true,
      required: true,
    },
    partOfSpeech: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      index: true, // ← ADD THIS: for difficulty filtering
    },
    module: {
      type: String,
      enum: ['reading', 'writing', 'listening', 'speaking'],
      required: true,
      default: 'reading',
      index: true, // For module filtering
    },
    searchableText: {
      type: String,
      index: true, // For efficient search across word, synonyms, antonyms
    },
  },
  { timestamps: true, versionKey: false },
);

// Compound index for combined difficulty + module filtering
WordSchema.index({ difficulty: 1, module: 1 });

// Pre-save hook: Auto-populate searchableText for efficient searching
WordSchema.pre('save', function () {
  this.searchableText = [
    this.word,
    this.meaning,
    ...(this.synonyms || []),
    ...(this.antonyms || []),
  ]
    .join(' ')
    .toLowerCase();
});

export const Word = mongoose.models.Word || mongoose.model<IWord>('Word', WordSchema);
