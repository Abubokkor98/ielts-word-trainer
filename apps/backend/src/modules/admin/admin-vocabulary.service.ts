import { QuizAttempt } from '../quiz/quiz-attempt.model';
import { Topic } from '../topics/topics.model';
import { Word } from '../words/words.model';
import type { TopWord, UnusedWord, UsageStats, VocabularyOverview, WordUsage } from './admin.types';

export class AdminVocabularyService {
  /**
   * Get comprehensive vocabulary overview metrics
   * Uses efficient MongoDB aggregations for optimal performance
   */
  static async getVocabularyOverview(): Promise<VocabularyOverview> {
    // Execute all aggregations in parallel for performance
    const [totalCount, byModule, byDifficulty, byTopic, avgAccuracy, unusedWordsCount] =
      await Promise.all([
        // Total vocabulary count
        Word.countDocuments(),

        // Words per module - unwind array and group
        Word.aggregate<{ _id: string; count: number }>([
          { $unwind: '$modules' },
          {
            $group: {
              _id: '$modules',
              count: { $sum: 1 },
            },
          },
        ]),

        // Words per difficulty
        Word.aggregate<{ _id: string; count: number }>([
          {
            $group: {
              _id: '$difficulty',
              count: { $sum: 1 },
            },
          },
        ]),

        // Words per topic with topic details
        Word.aggregate<{ _id: string; topicName: string; count: number }>([
          { $unwind: '$topics' },
          {
            $group: {
              _id: '$topics',
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: 'topics',
              localField: '_id',
              foreignField: '_id',
              as: 'topicInfo',
            },
          },
          { $unwind: '$topicInfo' },
          {
            $project: {
              _id: 1,
              topicName: '$topicInfo.name',
              count: 1,
            },
          },
          { $sort: { count: -1 } },
        ]),

        // Average word accuracy across all quiz attempts
        AdminVocabularyService.calculateAverageAccuracy(),

        // Count of words with zero attempts
        AdminVocabularyService.countUnusedWords(),
      ]);

    // Transform aggregation results to structured format
    const moduleDistribution = {
      reading: byModule.find((m) => m._id === 'reading')?.count || 0,
      writing: byModule.find((m) => m._id === 'writing')?.count || 0,
      listening: byModule.find((m) => m._id === 'listening')?.count || 0,
      speaking: byModule.find((m) => m._id === 'speaking')?.count || 0,
    };

    const difficultyDistribution = {
      beginner: byDifficulty.find((d) => d._id === 'beginner')?.count || 0,
      intermediate: byDifficulty.find((d) => d._id === 'intermediate')?.count || 0,
      advanced: byDifficulty.find((d) => d._id === 'advanced')?.count || 0,
    };

    const topicDistribution = byTopic.map((topic) => ({
      topicId: topic._id.toString(),
      topicName: topic.topicName || 'Unknown',
      count: topic.count,
    }));

    return {
      totalCount,
      byModule: moduleDistribution,
      byDifficulty: difficultyDistribution,
      byTopic: topicDistribution,
      avgAccuracy: Math.round(avgAccuracy * 10) / 10, // Round to 1 decimal
      unusedWordsCount,
    };
  }

  /**
   * Calculate average word accuracy across all quiz attempts
   */
  private static async calculateAverageAccuracy(): Promise<number> {
    const result = await QuizAttempt.aggregate<{ avgAccuracy: number }>([
      { $unwind: '$questions' },
      {
        $group: {
          _id: '$questions.wordId',
          totalAttempts: { $sum: 1 },
          correctAttempts: {
            $sum: {
              $cond: ['$questions.isCorrect', 1, 0],
            },
          },
        },
      },
      {
        $project: {
          accuracy: {
            $multiply: [
              {
                $divide: ['$correctAttempts', '$totalAttempts'],
              },
              100,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgAccuracy: { $avg: '$accuracy' },
        },
      },
    ]);

    return result[0]?.avgAccuracy || 0;
  }

  /**
   * Count words that have never been attempted in any quiz
   */
  private static async countUnusedWords(): Promise<number> {
    // Get all word IDs from QuizAttempts
    const attemptedWordIds = await QuizAttempt.aggregate<{ _id: string }>([
      { $unwind: '$questions' },
      {
        $group: {
          _id: '$questions.wordId',
        },
      },
    ]);

    const attemptedIds = attemptedWordIds.map((item) => item._id);

    // Count words NOT in the attempted list
    return Word.countDocuments({
      _id: { $nin: attemptedIds },
    });
  }

  /**
   * Get top performing words (>= 80% accuracy, >= 10 attempts)
   * Similar logic to getProblemWords but filtered for high accuracy
   */
  static async getTopWords(limit = 20): Promise<TopWord[]> {
    const topWordsAggregation = await QuizAttempt.aggregate<{
      wordId: string;
      attempts: number;
      accuracy: number;
    }>([
      { $unwind: '$questions' },
      {
        $group: {
          _id: '$questions.wordId',
          totalAttempts: { $sum: 1 },
          correctAttempts: {
            $sum: {
              $cond: ['$questions.isCorrect', 1, 0],
            },
          },
        },
      },
      {
        $project: {
          wordId: '$_id',
          attempts: '$totalAttempts',
          accuracy: {
            $multiply: [
              {
                $divide: ['$correctAttempts', '$totalAttempts'],
              },
              100,
            ],
          },
        },
      },
      {
        $match: {
          accuracy: { $gte: 80 }, // Top performing threshold
          attempts: { $gte: 10 }, // Statistical significance
        },
      },
      { $sort: { accuracy: -1, attempts: -1 } }, // Highest accuracy first
      { $limit: limit },
    ]);

    if (topWordsAggregation.length === 0) {
      return [];
    }

    // Get word details
    const wordIds = topWordsAggregation.map((w) => w.wordId);
    const words = await Word.find({ _id: { $in: wordIds } }).lean();

    // Merge aggregation results with word details
    return topWordsAggregation.map((tw) => {
      const word = words.find((w) => w._id.toString() === tw.wordId.toString());

      return {
        wordId: tw.wordId.toString(),
        word: word?.word || 'Unknown',
        meaning: word?.meaning || '',
        difficulty: word?.difficulty || 'beginner',
        accuracy: Math.round(tw.accuracy * 10) / 10,
        attempts: tw.attempts,
        lastUpdated: word?.updatedAt,
      };
    });
  }

  /**
   * Get words that have never been attempted in any quiz
   * Returns full word details for unused words + total count
   */
  static async getUnusedWords(limit = 50): Promise<{ words: UnusedWord[]; totalCount: number }> {
    // Get all unique word IDs from QuizAttempts
    const attemptedWordIds = await QuizAttempt.aggregate<{ _id: string }>([
      { $unwind: '$questions' },
      {
        $group: {
          _id: '$questions.wordId',
        },
      },
    ]);

    const attemptedIds = attemptedWordIds.map((item) => item._id);

    // Get total count of unused words (before limit)
    const totalCount = await Word.countDocuments({
      _id: { $nin: attemptedIds },
    });

    // Find words NOT in the attempted list (with limit)
    const unusedWords = await Word.find({
      _id: { $nin: attemptedIds },
    })
      .select('word meaning difficulty modules topics')
      .limit(limit)
      .lean();

    // Populate topic names
    const topicIds = unusedWords.flatMap((w) => w.topics || []);
    const topics = await Topic.find({ _id: { $in: topicIds } })
      .select('_id name')
      .lean();

    const topicMap = new Map(topics.map((t) => [t._id.toString(), t.name]));

    const words = unusedWords.map((word) => ({
      wordId: word._id.toString(),
      word: word.word,
      meaning: word.meaning,
      difficulty: word.difficulty,
      modules: word.modules || [],
      topics:
        word.topics?.map((topicId) => ({
          id: topicId.toString(),
          name: topicMap.get(topicId.toString()) || 'Unknown',
        })) || [],
    }));

    return { words, totalCount };
  }

  /**
   * Get word usage statistics (most and least reviewed)
   * Returns top N most reviewed and least reviewed words
   */
  static async getUsageStats(limit = 20): Promise<UsageStats> {
    // Get attempt counts for all words
    const wordUsage = await QuizAttempt.aggregate<{
      wordId: string;
      attempts: number;
    }>([
      { $unwind: '$questions' },
      {
        $group: {
          _id: '$questions.wordId',
          attempts: { $sum: 1 },
        },
      },
      {
        $project: {
          wordId: '$_id',
          attempts: 1,
          _id: 0,
        },
      },
    ]);

    // Get word details for all words with attempts
    const wordIds = wordUsage.map((w) => w.wordId);
    const words = await Word.find({ _id: { $in: wordIds } })
      .select('word meaning difficulty')
      .lean();

    const wordMap = new Map(words.map((w) => [w._id.toString(), w]));

    // Map usage data to word details
    const enrichedUsage: WordUsage[] = wordUsage
      .map((usage) => {
        const word = wordMap.get(usage.wordId.toString());
        if (!word) return null;

        return {
          wordId: usage.wordId.toString(),
          word: word.word,
          meaning: word.meaning,
          difficulty: word.difficulty,
          attemptCount: usage.attempts,
        };
      })
      .filter((item): item is WordUsage => item !== null);

    // Sort and get top/bottom
    const sortedByAttempts = [...enrichedUsage].sort((a, b) => b.attemptCount - a.attemptCount);

    return {
      mostReviewed: sortedByAttempts.slice(0, limit),
      leastReviewed: sortedByAttempts.slice(-limit).reverse(),
    };
  }
}
