import mongoose, { Schema, Document } from 'mongoose';

export interface IWord extends Document {
  word: string;
  meaning: string;
  exampleSentence: string;
  synonyms?: string[];
  antonyms?: string[];
  topic?: mongoose.Types.ObjectId | string;
  partOfSpeech?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

const WordSchema = new Schema<IWord>(
  {
    word: { type: String, required: true, index: true },
    meaning: { type: String, required: true },
    exampleSentence: { type: String, required: true },
    synonyms: [{ type: String }],
    antonyms: [{ type: String }],
    topic: { type: Schema.Types.ObjectId, ref: 'Topic', index: true },
    partOfSpeech: { type: String },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
  },
  { timestamps: true, versionKey: false }
);

export const Word = mongoose.model<IWord>('Word', WordSchema);
