import mongoose, { Schema, Document } from 'mongoose';

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
    },
    module: {
      type: String,
      enum: ['reading', 'writing', 'listening', 'speaking'],
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Word = mongoose.model<IWord>('Word', WordSchema);
