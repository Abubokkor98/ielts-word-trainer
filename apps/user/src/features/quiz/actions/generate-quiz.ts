'use server';

import { QuestionType } from '@ielts/shared';
import type { Question, Option } from '../types';
import type { Word } from '../../vocabulary/types';
import { vocabularyData } from '../../../data/vocabulary';
import { shuffle } from '../../../lib/shuffle';

const QUESTION_TYPE_THRESHOLDS = {
  WORD_TO_MEANING: 0.4,
  MEANING_TO_WORD: 0.7,
  SYNONYM_MATCH: 0.85,
  ANTONYM_MATCH: 0.95,
  // SENTENCE_COMPLETION is the remainder (5%)
} as const;

const MINIMUM_WORDS_FOR_QUIZ = 4;
const DEFAULT_QUIZ_SIZE = 10;

function selectQuestionType(): QuestionType {
  const rand = Math.random();
  if (rand < QUESTION_TYPE_THRESHOLDS.WORD_TO_MEANING) return QuestionType.WORD_TO_MEANING;
  if (rand < QUESTION_TYPE_THRESHOLDS.MEANING_TO_WORD) return QuestionType.MEANING_TO_WORD;
  if (rand < QUESTION_TYPE_THRESHOLDS.SYNONYM_MATCH) return QuestionType.SYNONYM_MATCH;
  if (rand < QUESTION_TYPE_THRESHOLDS.ANTONYM_MATCH) return QuestionType.ANTONYM_MATCH;
  return QuestionType.SENTENCE_COMPLETION;
}

function buildWordDetails(word: Word) {
  return {
    word: word.word,
    meaning: word.meaning,
    exampleSentence: word.exampleSentence,
    partOfSpeech: word.partOfSpeech,
  };
}

function buildTextOptions(
  correctText: string,
  distractorTexts: string[],
  correctId: string,
  wrongPrefix: string,
): Option[] {
  const normalizedCorrect = correctText.trim().toLowerCase();
  const uniqueDistractors = [...new Set(distractorTexts.map((t) => t.trim()))]
    .filter((t) => t.toLowerCase() !== normalizedCorrect)
    .slice(0, 3);

  const texts = shuffle([correctText, ...uniqueDistractors]);
  let consumedCorrect = false;

  return texts.map((text, idx) => {
    const isCorrect = !consumedCorrect && text.trim().toLowerCase() === normalizedCorrect;
    if (isCorrect) consumedCorrect = true;
    return { id: isCorrect ? correctId : `${wrongPrefix}_${idx}`, text };
  });
}

function generateWordToMeaning(word: Word, quizPool: Word[]): Question {
  const distractors = shuffle(
    quizPool.filter((w) => w.id !== word.id)
  ).slice(0, 3);

  const options: Option[] = shuffle([word, ...distractors]).map((w) => ({
    id: w.id,
    text: w.meaning,
  }));

  return {
    id: word.id,
    type: QuestionType.WORD_TO_MEANING,
    question: `What is the meaning of "${word.word}"?`,
    options,
    correctAnswer: word.id,
    wordId: word.id,
    wordDetails: buildWordDetails(word),
  };
}

function generateMeaningToWord(word: Word, quizPool: Word[]): Question {
  const distractors = shuffle(
    quizPool.filter((w) => w.id !== word.id)
  ).slice(0, 3);

  const options: Option[] = shuffle([word, ...distractors]).map((w) => ({
    id: w.id,
    text: w.word,
  }));

  return {
    id: word.id,
    type: QuestionType.MEANING_TO_WORD,
    question: `Which word means "${word.meaning}"?`,
    options,
    correctAnswer: word.id,
    wordId: word.id,
    wordDetails: buildWordDetails(word),
  };
}

function generateSynonymMatch(word: Word, quizPool: Word[]): Question {
  if (!word.synonyms || word.synonyms.length === 0) {
    return generateWordToMeaning(word, quizPool);
  }

  const correctSynonym = word.synonyms[0];
  const distractors = shuffle(
    quizPool.filter((w) => w.id !== word.id).map((w) => w.word)
  ).slice(0, 3);

  const options = buildTextOptions(correctSynonym, distractors, word.id, 'opt');

  return {
    id: word.id,
    type: QuestionType.SYNONYM_MATCH,
    question: `Select a synonym for "${word.word}"`,
    options,
    correctAnswer: word.id,
    wordId: word.id,
    wordDetails: buildWordDetails(word),
  };
}

function generateAntonymMatch(word: Word, quizPool: Word[]): Question {
  if (!word.antonyms || word.antonyms.length === 0) {
    return generateWordToMeaning(word, quizPool);
  }

  const correctAntonym = word.antonyms[0];
  const distractors = shuffle(
    quizPool.filter((w) => w.id !== word.id).map((w) => w.word)
  ).slice(0, 3);

  const options = buildTextOptions(correctAntonym, distractors, word.id, 'opt');

  return {
    id: word.id,
    type: QuestionType.ANTONYM_MATCH,
    question: `Select an antonym for "${word.word}"`,
    options,
    correctAnswer: word.id,
    wordId: word.id,
    wordDetails: buildWordDetails(word),
  };
}

function generateSentenceCompletion(word: Word, quizPool: Word[]): Question {
  const hasWordInSentence =
    word.exampleSentence?.toLowerCase().includes(word.word.toLowerCase());

  if (!hasWordInSentence) {
    return generateWordToMeaning(word, quizPool);
  }

  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const sentence = word.exampleSentence.replace(
    new RegExp(escapeRegex(word.word), 'gi'),
    '_____',
  );

  const distractors = shuffle(
    quizPool.filter((w) => w.id !== word.id).map((w) => w.word)
  ).slice(0, 3);

  const options = buildTextOptions(word.word, distractors, word.id, 'dist');

  return {
    id: word.id,
    type: QuestionType.SENTENCE_COMPLETION,
    question: `Complete the sentence: "${sentence}"`,
    options,
    correctAnswer: word.id,
    wordId: word.id,
    wordDetails: buildWordDetails(word),
  };
}

export async function generateLocalQuiz(
  difficulty: string,
  limit: number = DEFAULT_QUIZ_SIZE,
): Promise<Question[]> {
  // Filter pool by difficulty (distractors come from the SAME pool)
  const pool = difficulty === 'mixed' || difficulty === 'all'
    ? vocabularyData
    : vocabularyData.filter(w => w.difficulty === difficulty);

  if (pool.length < MINIMUM_WORDS_FOR_QUIZ) {
    throw new Error('Not enough words available for this difficulty level to generate a quiz.');
  }

  const selectedWords = shuffle(pool).slice(0, limit);

  return selectedWords.map((word) => {
    const type = selectQuestionType();

    switch (type) {
      case QuestionType.WORD_TO_MEANING:
        return generateWordToMeaning(word, selectedWords);
      case QuestionType.MEANING_TO_WORD:
        return generateMeaningToWord(word, selectedWords);
      case QuestionType.SYNONYM_MATCH:
        return generateSynonymMatch(word, selectedWords);
      case QuestionType.ANTONYM_MATCH:
        return generateAntonymMatch(word, selectedWords);
      case QuestionType.SENTENCE_COMPLETION:
        return generateSentenceCompletion(word, selectedWords);
      default:
        return generateWordToMeaning(word, selectedWords);
    }
  });
}
