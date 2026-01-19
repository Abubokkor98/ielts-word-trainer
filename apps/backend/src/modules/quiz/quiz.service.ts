import { AppError } from '../../core/errors/AppError';
import { QuestionType } from '../../shared';
import { SRSService } from '../srs/srs.service';
import { type IWord, Word } from '../words/words.model';

export class QuizService {
  static async generateQuiz(
    userId?: string, // Made optional
    topicId?: string,
    difficulty?: string,
    limit: number = 10,
  ) {
    let selectedWords: IWord[] = [];

    // Only check SRS if we have a user
    if (userId) {
      // Priority 1: Due words (SRS)
      // We need to import SRSService dynamically or normally.
      // Since we are in QuizService, let's assume we can import SRSService if no circular dep issue,
      // or use dynamic import inside the method.

      const dueWords = await SRSService.getDueWords({
        userId,
        topicId,
        difficulty,
        limit,
      });

      selectedWords = [...dueWords];

      // Priority 2: Fill remaining slots with new words
      if (selectedWords.length < limit) {
        const remainingCount = limit - selectedWords.length;
        const newWords = await SRSService.getNewWords(userId, topicId, difficulty, remainingCount);
        selectedWords = [...selectedWords, ...newWords];
      }
    }

    // Priority 3: Fallback (if still not enough, e.g. viewed all words but none due?)
    // This case should be rare if getNewWords covers everything not seen.
    // If user has mastered EVERYTHING and nothing is due, we might want to review mastered or random.
    // For now, let's fill with random words if we still don't have enough (maybe from mastered pool)
    if (selectedWords.length < 4) {
      // ensuring min 4 for distractors logic
      const filter: any = {};
      if (topicId) filter.topics = topicId;
      if (difficulty) filter.difficulty = difficulty;

      // Exclude already selected
      const selectedIds = selectedWords.map((w) => w._id);
      filter._id = { $nin: selectedIds };

      const randomFill = await Word.find(filter)
        .limit(limit - selectedWords.length)
        .lean();
      selectedWords = [...selectedWords, ...randomFill];
    }

    if (selectedWords.length < 4) {
      throw new AppError('Not enough words to generate a quiz (min 4 required)', 400);
    }

    // Shuffle the final selection so due/new words are mixed
    const shuffled = selectedWords.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, limit);

    return selected.map((word, index) => {
      // Determine question type based on probability
      const type = QuizService.selectQuestionType(index);

      switch (type) {
        case QuestionType.WORD_TO_MEANING:
          return QuizService.generateWordToMeaning(word, selected);
        case QuestionType.MEANING_TO_WORD:
          return QuizService.generateMeaningToWord(word, selected);
        case QuestionType.SYNONYM_MATCH:
          return QuizService.generateSynonymMatch(word, selected);
        case QuestionType.ANTONYM_MATCH:
          return QuizService.generateAntonymMatch(word, selected);
        case QuestionType.SENTENCE_COMPLETION:
          return QuizService.generateSentenceCompletion(word, selected);
        default:
          return QuizService.generateWordToMeaning(word, selected);
      }
    });
  }

  private static selectQuestionType(_index: number): QuestionType {
    const rand = Math.random();
    // 40% Word -> Meaning
    // 30% Meaning -> Word
    // 15% Synonym
    // 10% Antonym
    // 5% Sentence
    if (rand < 0.4) return QuestionType.WORD_TO_MEANING;
    if (rand < 0.7) return QuestionType.MEANING_TO_WORD;
    if (rand < 0.85) return QuestionType.SYNONYM_MATCH;
    if (rand < 0.95) return QuestionType.ANTONYM_MATCH;
    return QuestionType.SENTENCE_COMPLETION;
  }

  private static generateWordToMeaning(word: IWord, allWords: IWord[]) {
    // Pick 3 distractors
    const distractors = allWords
      .filter((w) => w._id.toString() !== word._id.toString())
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [word, ...distractors]
      .sort(() => 0.5 - Math.random())
      .map((w) => ({ id: w._id, text: w.meaning }));

    return {
      id: word._id,
      type: QuestionType.WORD_TO_MEANING,
      question: `What is the meaning of "${word.word}"?`,
      options,
      correctAnswer: word._id,
      wordDetails: word, // Return full word object for feedback
    };
  }

  private static generateMeaningToWord(word: IWord, allWords: IWord[]) {
    const distractors = allWords
      .filter((w) => w._id.toString() !== word._id.toString())
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [word, ...distractors]
      .sort(() => 0.5 - Math.random())
      .map((w) => ({ id: w._id, text: w.word }));

    return {
      id: word._id,
      type: QuestionType.MEANING_TO_WORD,
      question: `Which word means "${word.meaning}"?`,
      options,
      correctAnswer: word._id,
      wordDetails: word,
    };
  }

  private static generateSynonymMatch(word: IWord, allWords: IWord[]) {
    if (!word.synonyms || word.synonyms.length === 0) {
      return QuizService.generateWordToMeaning(word, allWords);
    }

    const correctSynonym = word.synonyms[0];
    const distractors = allWords
      .filter((w) => w._id.toString() !== word._id.toString())
      .map((w) => w.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correctSynonym, ...distractors]
      .sort(() => 0.5 - Math.random())
      .map((text, idx) => ({
        id: text === correctSynonym ? word._id : `opt_${idx}`,
        text,
      }));

    return {
      id: word._id,
      type: QuestionType.SYNONYM_MATCH,
      question: `Select a synonym for "${word.word}"`,
      options,
      correctAnswer: word._id,
      wordDetails: word,
    };
  }

  private static generateAntonymMatch(word: IWord, allWords: IWord[]) {
    if (!word.antonyms || word.antonyms.length === 0) {
      return QuizService.generateWordToMeaning(word, allWords);
    }

    const correctAntonym = word.antonyms[0];
    const distractors = allWords
      .filter((w) => w._id.toString() !== word._id.toString())
      .map((w) => w.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correctAntonym, ...distractors]
      .sort(() => 0.5 - Math.random())
      .map((text, idx) => ({
        id: text === correctAntonym ? word._id : `opt_${idx}`,
        text,
      }));

    return {
      id: word._id,
      type: QuestionType.ANTONYM_MATCH,
      question: `Select an antonym for "${word.word}"`,
      options,
      correctAnswer: word._id,
      wordDetails: word,
    };
  }

  private static generateSentenceCompletion(word: IWord, allWords: IWord[]) {
    if (
      !word.exampleSentence ||
      !word.exampleSentence.toLowerCase().includes(word.word.toLowerCase())
    ) {
      return QuizService.generateWordToMeaning(word, allWords);
    }

    // Escape special regex characters to prevent ReDoS and matching issues
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const sentence = word.exampleSentence.replace(
      new RegExp(escapeRegex(word.word), 'gi'),
      '_____',
    );

    const distractors = allWords
      .filter((w) => w._id.toString() !== word._id.toString())
      .map((w) => w.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [word.word, ...distractors]
      .sort(() => 0.5 - Math.random())
      .map((text, idx) => ({
        id: text === word.word ? word._id : `dist_${idx}`,
        text,
      }));

    return {
      id: word._id,
      type: QuestionType.SENTENCE_COMPLETION,
      question: `Complete the sentence: "${sentence}"`,
      options,
      correctAnswer: word._id,
      wordDetails: word,
    };
  }
}
