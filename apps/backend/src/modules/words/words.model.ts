import mongoose, { type Document, Schema } from 'mongoose';

export interface IWord extends Document {
  word: string;
  meaning: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
  topics: mongoose.Types.ObjectId[] | string[];
  partOfSpeech: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: ('reading' | 'writing' | 'listening' | 'speaking')[];
  searchableText?: string; // Auto-populated for efficient search
}

const WordSchema = new Schema<IWord>(
  {
    word: { type: String, required: true, index: true },
    meaning: { type: String, required: true },
    exampleSentence: { type: String, required: true },
    synonyms: { type: [String], required: true },
    antonyms: { type: [String], required: true },
    topics: {
      type: [Schema.Types.ObjectId],
      ref: 'Topic',
      required: true,
      validate: {
        validator: (v: mongoose.Types.ObjectId[]) => v && v.length > 0,
        message: 'At least one topic is required',
      },
      index: true, // Index array for efficient $in queries
    },
    partOfSpeech: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      // index: true, // For difficulty filtering - Removed as covered by compound index
    },
    modules: {
      type: [String],
      enum: ['reading', 'writing', 'listening', 'speaking'],
      required: true,
      validate: {
        validator: (v: string[]) => v && v.length > 0,
        message: 'At least one module is required',
      },
      index: true, // Index array for efficient filtering
    },
    searchableText: {
      type: String,
      index: true, // For efficient search across word, synonyms, antonyms
    },
  },
  { timestamps: true, versionKey: false },
);

// Compound index for combined difficulty + modules filtering
WordSchema.index({ difficulty: 1, modules: 1 });

// Pre-save hook: Auto-populate searchableText and normalize word to lowercase
WordSchema.pre('save', function () {
  if (this.word) {
    this.word = this.word.toLowerCase().trim();
  }
  this.searchableText = [this.word, ...(this.synonyms || []), ...(this.antonyms || [])]
    .join(' ')
    .toLowerCase();
});

export const Word = mongoose.models.Word || mongoose.model<IWord>('Word', WordSchema);
