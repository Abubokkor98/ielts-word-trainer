import { Word } from '../words/words.model';
import { AppError } from '../../core/errors/AppError';

export class QuizService {
  static async generateQuiz(
    topicId?: string,
    difficulty?: string,
    limit: number = 10
  ) {
    const filter: any = {};
    if (topicId) filter.topic = topicId;
    if (difficulty) filter.difficulty = difficulty;

    const words = await Word.find(filter).lean();

    if (words.length < 4) {
      throw new AppError(
        'Not enough words to generate a quiz (min 4 required)',
        400
      );
    }

    // Shuffle words
    const shuffled = words.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(limit, words.length));

    return selected.map((word) => {
      // Pick 3 distractors
      const distractors = words
        .filter((w) => w._id.toString() !== word._id.toString())
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [word, ...distractors]
        .sort(() => 0.5 - Math.random())
        .map((w) => ({ id: w._id, text: w.meaning })); // Question: Word, Options: Meanings

      return {
        id: word._id,
        question: `What is the meaning of "${word.word}"?`,
        options,
        correctAnswer: word._id, // In a real app, don't send this to client if validating on server
      };
    });
  }
}
