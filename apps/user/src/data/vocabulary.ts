import rawVocabData from './vocabulary.json';
import type { Word } from '../features/vocabulary/types';

/**
 * Single centralized assertion for the vocabulary JSON data.
 * Every file should import from here instead of repeating `as unknown as Word[]`.
 */
export const vocabularyData: Word[] = rawVocabData as unknown as Word[];
