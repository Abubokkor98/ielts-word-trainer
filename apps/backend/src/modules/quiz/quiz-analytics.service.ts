import mongoose from 'mongoose';
import { AppError } from '../../core/errors/AppError';
import { QuizAttempt } from './quiz-attempt.model';

export class QuizAnalyticsService {
  static async getUserAnalytics(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid user ID format', 400);
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [statsResult, recentAttempts, difficultyStats, topicStats, trendAttempts] =
      await Promise.all([
        // 1. Overall Stats Aggregation (Optimized)
        QuizAttempt.aggregate([
          { $match: { userId: userObjectId } },
          {
            $group: {
              _id: null,
              totalAttempts: { $sum: 1 },
              totalScore: { $sum: '$score' },
              totalQuestions: { $sum: '$totalQuestions' },
              totalTime: { $sum: '$totalTimeSpent' },
              maxScore: { $max: { $divide: ['$score', '$totalQuestions'] } },
              minScore: { $min: { $divide: ['$score', '$totalQuestions'] } },
              correctAnswers: { $sum: '$score' }, // Assuming score = correct answers count
            },
          },
        ]),

        // 2. Recent attempts (Limit 10 for trend & recent list)
        QuizAttempt.find({ userId: userObjectId })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),

        // 3. Performance by Difficulty
        QuizAttempt.aggregate([
          { $match: { userId: userObjectId } },
          {
            $group: {
              _id: '$difficulty',
              avgScore: { $avg: { $divide: ['$score', '$totalQuestions'] } },
              count: { $sum: 1 },
            },
          },
        ]),

        // 4. Performance by Topic
        QuizAttempt.aggregate([
          { $match: { userId: userObjectId } },
          {
            $group: {
              _id: '$topic',
              avgScore: { $avg: { $divide: ['$score', '$totalQuestions'] } },
              count: { $sum: 1 },
            },
          },
        ]),

        // 5. Trend attempts (Last 7 days)
        QuizAttempt.find({ userId: userObjectId, createdAt: { $gte: sevenDaysAgo } })
          .sort({ createdAt: -1 })
          .lean(),
      ]);

    // Handle empty state
    if (!statsResult[0]) {
      return {
        totalAttempts: 0,
        totalQuizzes: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        averageTimePerQuestion: 0,
        performanceByDifficulty: {},
        performanceByTopic: {},
        recentAttempts: [],
        progressTrend: [],
      };
    }

    const s = statsResult[0];
    const averageScore =
      s.totalQuestions > 0 ? (s.totalScore / s.totalQuestions) * 100 : 0;
    const averageTimePerQuestion =
      s.totalQuestions > 0 ? s.totalTime / s.totalQuestions : 0;

    // Format Maps
    const performanceByDifficulty = difficultyStats.reduce((acc, stat) => {
      acc[stat._id || 'mixed'] = {
        averageScore: (stat.avgScore * 100).toFixed(1),
        attempts: stat.count,
      };
      return acc;
    }, {} as Record<string, any>);

    const performanceByTopic = topicStats.reduce((acc, stat) => {
      acc[stat._id || 'mixed'] = {
        averageScore: (stat.avgScore * 100).toFixed(1),
        attempts: stat.count,
      };
      return acc;
    }, {} as Record<string, any>);

    // Format Trend (last 7 days)
    const progressTrend = [...trendAttempts]
      .reverse() // Oldest to newest
      .map((attempt, index) => ({
        attempt: index + 1, // Approximation for graph X-axis
        score:
          attempt.totalQuestions > 0
            ? ((attempt.score / attempt.totalQuestions) * 100).toFixed(1)
            : '0.0',
        date: attempt.createdAt,
      }));

    // Format Recent (last 5)
    // Map the lean objects (which have _id as ObjectId) to string ID if needed, or keeping it as is
    // since frontend likely handles it. But explicit mapping is safer.
    const formattedRecentAttempts = recentAttempts.slice(0, 5).map((a) => ({
      id: a._id.toString(),
      score: a.score,
      totalQuestions: a.totalQuestions,
      percentage: ((a.score / a.totalQuestions) * 100).toFixed(1),
      timeSpent: a.totalTimeSpent,
      difficulty: a.difficulty,
      topic: a.topic,
      completedAt: a.createdAt,
    }));

    return {
      totalAttempts: s.totalAttempts,
      totalQuizzes: s.totalAttempts,
      totalQuestionsAnswered: s.totalQuestions,
      correctAnswers: s.correctAnswers,
      averageScore: averageScore.toFixed(1),
      bestScore: (s.maxScore * 100).toFixed(1),
      worstScore: (s.minScore * 100).toFixed(1),
      averageTimePerQuestion: (averageTimePerQuestion / 1000).toFixed(1),
      performanceByDifficulty,
      performanceByTopic,
      recentAttempts: formattedRecentAttempts,
      progressTrend,
    };
  }

  static async getGlobalAnalytics() {
    const totalAttempts = await QuizAttempt.countDocuments();
    const totalUsers = await QuizAttempt.distinct('userId').then(
      (users) => users.length
    );

    const avgScoreResult = await QuizAttempt.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: { $divide: ['$score', '$totalQuestions'] } },
        },
      },
    ]);

    const globalAverageScore =
      avgScoreResult.length > 0
        ? (avgScoreResult[0].avgScore * 100).toFixed(1)
        : '0';

    // Most challenging topics
    const topicDifficulty = await QuizAttempt.aggregate([
      { $match: { topic: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$topic',
          avgScore: { $avg: { $divide: ['$score', '$totalQuestions'] } },
          attempts: { $sum: 1 },
        },
      },
      { $sort: { avgScore: 1 } },
      { $limit: 5 },
    ]);

    const challengingTopics = topicDifficulty.map((t) => ({
      topic: t._id,
      averageScore: (t.avgScore * 100).toFixed(1),
      attempts: t.attempts,
    }));

    return {
      totalAttempts,
      totalUsers,
      globalAverageScore,
      challengingTopics,
    };
  }
  static async getRecommendedDifficulty(userId: string): Promise<{
    recommendation: 'increase' | 'decrease' | 'maintain';
    reason: string;
  }> {
    const lastAttempts = await QuizAttempt.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .limit(5);

    if (lastAttempts.length < 5) {
      return { recommendation: 'maintain', reason: 'Not enough data yet' };
    }

    const avgScore =
      lastAttempts.reduce((sum, a) => sum + a.score / a.totalQuestions, 0) /
      lastAttempts.length;

    const currentDifficulty = lastAttempts[0].difficulty || 'mixed';

    // For 'mixed' difficulty, only recommend changes for extreme performance
    if (currentDifficulty === 'mixed') {
      if (avgScore > 0.85) {
        return {
          recommendation: 'increase',
          reason: "You are crushing it! Consider trying 'Advanced' difficulty.",
        };
      } else if (avgScore < 0.4) {
        return {
          recommendation: 'decrease',
          reason: "Struggling a bit? Try 'Beginner' to build confidence.",
        };
      }
      // For mixed, moderate performance (40-85%) is fine - stay on mixed
      return {
        recommendation: 'maintain',
        reason: 'Mixed difficulty is working well for you!',
      };
    }

    // For specific difficulties, recommend changes with normal thresholds
    if (avgScore > 0.8 && currentDifficulty !== 'advanced') {
      return {
        recommendation: 'increase',
        reason: 'You are crushing it! Ready for a harder challenge?',
      };
    }

    if (avgScore < 0.5 && currentDifficulty !== 'beginner') {
      return {
        recommendation: 'decrease',
        reason: 'Review basics? Trying a lower difficulty might help.',
      };
    }

    return {
      recommendation: 'maintain',
      reason: 'You are doing great at this level!',
    };
  }
}
