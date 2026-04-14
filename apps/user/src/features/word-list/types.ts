import type { Word } from '../vocabulary/types';

export interface WordList {
  _id: string;
  name: string;
  words: Word[];
  createdAt: string;
  updatedAt: string;
}
