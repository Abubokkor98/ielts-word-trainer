import { SRSItem } from './srs.model';
import { getNextReviewDate } from '@ielts/shared';
import { SRSStatus } from '@ielts/shared';

export class SRSService {
  static async reviewWord(userId: string, wordId: string, quality: number) {
    let srsItem = await SRSItem.findOne({ user: userId, word: wordId });

    if (!srsItem) {
      srsItem = new SRSItem({
        user: userId,
        word: wordId,
        repetition: 0,
        interval: 0,
        easeFactor: 2.5,
        status: SRSStatus.LEARNING,
      });
    }

    // Dynamic import to avoid circular dependency issues if any
    const { calculateSM2, getNextReviewDate } = await import('@ielts/shared');

    // Calculate new parameters using SM-2
    // If first time or reset, ensure defaults
    const prevInterval = srsItem.interval || 0;
    const prevRepetitions = srsItem.repetition || 0;
    const prevEaseFactor = srsItem.easeFactor || 2.5;

    const { interval, repetitions, easeFactor } = calculateSM2({
      quality,
      prevInterval,
      prevRepetitions,
      prevEaseFactor,
    });

    // Update item
    srsItem.interval = interval;
    srsItem.repetition = repetitions;
    srsItem.easeFactor = easeFactor;
    srsItem.quality = quality;
    srsItem.lastReviewed = new Date();
    srsItem.nextReviewDate = getNextReviewDate(interval);

    // Update Status
    if (quality < 3) {
      srsItem.status = SRSStatus.LEARNING;
      srsItem.lapseCount = (srsItem.lapseCount || 0) + 1;
    } else {
      // Using 5 reps as a threshold for "MASTERED" is a heuristic.
      if (srsItem.repetition >= 5) {
        srsItem.status = SRSStatus.MASTERED;
      } else {
        srsItem.status = SRSStatus.REVIEWING;
      }
    }

    return srsItem.save();
  }

  static async getDueWords(
    userId: string,
    topicId?: string,
    difficulty?: string,
    limit: number = 20
  ) {
    const filter: any = {
      user: userId,
      nextReviewDate: { $lte: new Date() },
      status: { $ne: SRSStatus.MASTERED },
    };

    const srsItems = await SRSItem.find(filter).populate('word').limit(limit);

    // Filter by topic/difficulty if provided (since these are on the Word model, not SRSItem)
    // Note: This is an in-memory filter which is not ideal for large datasets but acceptable for MVP
    let words = srsItems.map((item) => item.word as any).filter((w) => !!w);

    if (topicId) {
      words = words.filter((w) => w.topic?.toString() === topicId);
    }
    if (difficulty) {
      words = words.filter((w) => w.difficulty === difficulty);
    }

    // Sort by due date (implied by insertion/find order usually, but effectively random bucket here is fine)
    return words;
  }

  static async getNewWords(
    userId: string,
    topicId?: string,
    difficulty?: string,
    limit: number = 10
  ) {
    // Find words user hasn't seen yet
    const userSRSItems = await SRSItem.find({ user: userId }).select('word');
    const seenWordIds = userSRSItems.map((item) => item.word);

    const filter: any = {
      _id: { $nin: seenWordIds },
    };
    if (topicId) filter.topic = topicId;
    if (difficulty) filter.difficulty = difficulty;

    // Utilize Word model to find new words
    // We need to import Word, but avoiding circular dependency if possible.
    // Assuming Word model is registered or we can import it.
    // Dynamic import to avoid potential circular deps if QuizService imports SRSService
    const { Word } = await import('../words/words.model');

    return Word.find(filter).limit(limit).lean();
  }
}
