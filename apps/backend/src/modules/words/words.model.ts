import mongoose, { Schema, Document } from 'mongoose';

export interface IWord extends Document {
  word: string;
  meaning: string;
  exampleSentence: string;
  synonyms?: string[];
  antonyms?: string[];
  topic?: string;
  partOfSpeech?: string;
  pronunciation?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

const WordSchema = new Schema<IWord>(
  {
    word: { type: String, required: true, index: true },
    meaning: { type: String, required: true },
    exampleSentence: { type: String, required: true },
    synonyms: [{ type: String }],
    antonyms: [{ type: String }],
    topic: { type: String },
    partOfSpeech: { type: String },
    pronunciation: { type: String },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
  },
  { timestamps: true, versionKey: false }
);

export const Word = mongoose.model<IWord>('Word', WordSchema);
