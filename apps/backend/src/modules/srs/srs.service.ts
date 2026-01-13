import { calculateSM2, getNextReviewDate, SRSStatus } from '@ielts/shared';
import mongoose from 'mongoose';
import { Word } from '../words/words.model';
import { SRSItem } from './srs.model';

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

  static async bulkReview(
    userId: string,
    reviews: { wordId: string; quality: number }[]
  ) {
    if (reviews.length === 0) return;

    // 1. Fetch existing SRS items for these words
    const wordIds = reviews.map((r) => r.wordId);
    const existingItems = await SRSItem.find({
      user: userId,
      word: { $in: wordIds },
    });

    const itemMap = new Map(
      existingItems.map((item) => [item.word.toString(), item])
    );

    // 2. Prepare bulk operations
    const bulkOps = reviews.map(({ wordId, quality }) => {
      const existingItem = itemMap.get(wordId);

      // Default values for new items
      const prevInterval = existingItem?.interval || 0;
      const prevRepetitions = existingItem?.repetition || 0;
      const prevEaseFactor = existingItem?.easeFactor || 2.5;

      const { interval, repetitions, easeFactor } = calculateSM2({
        quality,
        prevInterval,
        prevRepetitions,
        prevEaseFactor,
      });

      // Determine new status
      let status = SRSStatus.REVIEWING;

      if (quality < 3) {
        status = SRSStatus.LEARNING;
      } else if (repetitions >= 5) {
        status = SRSStatus.MASTERED;
      }

      const nextReviewDate = getNextReviewDate(interval);

      return {
        updateOne: {
          filter: {
            user: new mongoose.Types.ObjectId(userId),
            word: new mongoose.Types.ObjectId(wordId),
          },
          update: {
            $set: {
              interval,
              repetition: repetitions,
              easeFactor,
              quality,
              status,
              lastReviewed: new Date(),
              nextReviewDate,
            },
            $inc: { lapseCount: quality < 3 ? 1 : 0 },
          },
          upsert: true,
        },
      };
    });

    // 3. Execute bulk write
    if (bulkOps.length > 0) {
      await SRSItem.bulkWrite(bulkOps);
    }
  }

  static async getDueWords({
    userId,
    topicId,
    difficulty,
    limit = 20,
  }: {
    userId: string;
    topicId?: string;
    difficulty?: string;
    limit?: number;
  }) {
    const pipeline: any[] = [
      // 1. Match due SRS items
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          nextReviewDate: { $lte: new Date() },
          status: { $ne: SRSStatus.MASTERED },
        },
      },
      // 2. Join with Words to get details
      {
        $lookup: {
          from: 'words',
          localField: 'word',
          foreignField: '_id',
          as: 'wordDetails',
        },
      },
      // 3. Unwind (should always be 1-to-1)
      { $unwind: '$wordDetails' },
    ];

    // 4. Apply Filters on Word fields
    if (topicId) {
      pipeline.push({
        $match: {
          'wordDetails.topic': new mongoose.Types.ObjectId(topicId),
        },
      });
    }

    if (difficulty) {
      pipeline.push({
        $match: {
          'wordDetails.difficulty': difficulty,
        },
      });
    }

    // 5. Project and Limit
    pipeline.push(
      {
        $replaceRoot: { newRoot: '$wordDetails' }, // Return just the word object
      },
      { $limit: limit }
    );

    const words = await SRSItem.aggregate(pipeline);
    return words;
  }

  static async getNewWords(
    userId: string,
    topicId?: string,
    difficulty?: string,
    limit: number = 10
  ) {
    // Utilize Word model to find new words via Aggregation
    // Improved: Avoid fetching all seen IDs into memory ($nin method)
    const pipeline: any[] = [];

    // 1. Filter Words by Topic/Difficulty first (reduce search space)
    const matchStage: any = {};
    if (topicId) matchStage.topic = new mongoose.Types.ObjectId(topicId);
    if (difficulty) matchStage.difficulty = difficulty;

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // 2. Lookup SRS status for this user to check if "seen"
    // We use a correlated subquery to match ONLY this user's SRS records
    pipeline.push({
      $lookup: {
        from: 'srsitems',
        let: { wordId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$word', '$$wordId'] },
                  { $eq: ['$user', new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
          { $limit: 1 }, // Optimization: We only need to know if ONE exists
        ],
        as: 'isStudied',
      },
    });

    // 3. Exclude words that have an SRS entry (isStudied array is not empty)
    pipeline.push({
      $match: {
        isStudied: { $eq: [] },
      },
    });

    // 4. Sample or Limit
    // Using $sample for randomness like "New Words" should be, strictly speaking
    // But original code was just "find().limit()". Let's stick to simple limit for speed
    // unless user requests randomness. Implicit natural order is fine.
    pipeline.push(
      { $project: { isStudied: 0 } }, // Remove temp field
      { $limit: limit }
    );

    return Word.aggregate(pipeline);
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

      // Count new words using aggregation (avoids loading IDs into memory)
      Word.aggregate([
        {
          $lookup: {
            from: 'srsitems',
            let: { wordId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$word', '$$wordId'] },
                      { $eq: ['$user', new mongoose.Types.ObjectId(userId)] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ],
            as: 'studied',
          },
        },
        { $match: { studied: { $eq: [] } } },
        { $count: 'total' },
      ]).then((result) => result[0]?.total || 0),
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
