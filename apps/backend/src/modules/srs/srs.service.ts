import { SRSItem } from './srs.model';
import { getNextReviewDate, calculateSM2 } from '@ielts/shared';
import { SRSStatus } from '@ielts/shared';
import mongoose from 'mongoose';
import { Word } from '../words/words.model';

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
    const userSRSItems = await SRSItem.find({ user: userId })
      .select('word')
      .lean(); // Add .lean() for better performance
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

  static async getStats(userId: string) {
    // Use MongoDB aggregation + Promise.all for maximum performance
    // Guide version: runs aggregation and new words count in parallel
    const [stats, newWordsCount] = await Promise.all([
      // Single aggregation pipeline - all counting done in MongoDB
      SRSItem.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
          $facet: {
            totalWords: [{ $count: 'count' }],
            byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
            dueToday: [
              {
                $match: {
                  nextReviewDate: { $lte: new Date() },
                  status: { $ne: SRSStatus.MASTERED },
                },
              },
              { $count: 'count' },
            ],
          },
        },
      ]),

      // Get new words count in parallel (not in aggregation)
      SRSItem.distinct('word', { user: userId }).then((seenWordIds) =>
        Word.countDocuments({ _id: { $nin: seenWordIds } })
      ),
    ]);

    // Process aggregation results
    const statusMap = stats[0].byStatus.reduce(
      (
        acc: Record<string, number>,
        { _id, count }: { _id: string; count: number }
      ) => {
        acc[_id] = count;
        return acc;
      },
      {}
    );

    return {
      totalWords: stats[0].totalWords[0]?.count || 0,
      learning: statusMap[SRSStatus.LEARNING] || 0,
      reviewing: statusMap[SRSStatus.REVIEWING] || 0,
      mastered: statusMap[SRSStatus.MASTERED] || 0,
      dueToday: stats[0].dueToday[0]?.count || 0,
      newToday: newWordsCount,
    };
  }

  static async getWordStatus(userId: string, wordId: string) {
    const srsItem = await SRSItem.findOne({ user: userId, word: wordId });

    if (!srsItem) {
      return {
        status: 'new',
        interval: null,
        repetition: null,
        easeFactor: null,
        nextReviewDate: null,
        lastReviewed: null,
        lapseCount: 0,
      };
    }

    return {
      status: srsItem.status,
      interval: srsItem.interval,
      repetition: srsItem.repetition,
      easeFactor: srsItem.easeFactor,
      nextReviewDate: srsItem.nextReviewDate,
      lastReviewed: srsItem.lastReviewed,
      lapseCount: srsItem.lapseCount,
    };
  }

  static async getReviewSchedule(userId: string, days: number = 7) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const items = await SRSItem.find({
      user: userId,
      nextReviewDate: { $gte: startDate, $lte: endDate },
      status: { $ne: SRSStatus.MASTERED },
    })
      .populate('word')
      .lean();

    // Group by date
    const schedule: Record<string, { count: number; words: any[] }> = {};

    items.forEach((item: any) => {
      if (!item.nextReviewDate || !item.word) return;

      const dateKey = item.nextReviewDate.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!schedule[dateKey]) {
        schedule[dateKey] = { count: 0, words: [] };
      }

      schedule[dateKey].count++;
      schedule[dateKey].words.push({
        id: item.word._id,
        word: item.word.word,
        difficulty: item.word.difficulty,
      });
    });

    return schedule;
  }
}
