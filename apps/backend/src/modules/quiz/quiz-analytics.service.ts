import { QuizAttempt } from './quiz-attempt.model';
import mongoose from 'mongoose';

export class QuizAnalyticsService {
  static async getUserAnalytics(userId: string) {
    const attempts = await QuizAttempt.find({ userId }).sort({ createdAt: -1 });

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
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

    // Calculate basic stats
    const scores = attempts.map((a) => (a.score / a.totalQuestions) * 100);
    const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    const totalTime = attempts.reduce((sum, a) => sum + a.totalTimeSpent, 0);
    const totalQuestions = attempts.reduce(
      (sum, a) => sum + a.totalQuestions,
      0
    );
    const averageTimePerQuestion = totalTime / totalQuestions;

    // Performance by difficulty
    const difficultyStats = await QuizAttempt.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$difficulty',
          avgScore: { $avg: { $divide: ['$score', '$totalQuestions'] } },
          count: { $sum: 1 },
        },
      },
    ]);

    const performanceByDifficulty = difficultyStats.reduce((acc, stat) => {
      acc[stat._id || 'mixed'] = {
        averageScore: (stat.avgScore * 100).toFixed(1),
        attempts: stat.count,
      };
      return acc;
    }, {} as Record<string, any>);

    // Performance by topic
    const topicStats = await QuizAttempt.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$topic',
          avgScore: { $avg: { $divide: ['$score', '$totalQuestions'] } },
          count: { $sum: 1 },
        },
      },
    ]);

    const performanceByTopic = topicStats.reduce((acc, stat) => {
      acc[stat._id || 'mixed'] = {
        averageScore: (stat.avgScore * 100).toFixed(1),
        attempts: stat.count,
      };
      return acc;
    }, {} as Record<string, any>);

    // Progress trend (last 10 attempts)
    const progressTrend = attempts
      .slice(0, 10)
      .reverse()
      .map((attempt, index) => ({
        attempt: index + 1,
        score: ((attempt.score / attempt.totalQuestions) * 100).toFixed(1),
        date: attempt.createdAt,
      }));

    // Recent attempts details
    const recentAttempts = attempts.slice(0, 5).map((a) => ({
      id: a._id,
      score: a.score,
      totalQuestions: a.totalQuestions,
      percentage: ((a.score / a.totalQuestions) * 100).toFixed(1),
      timeSpent: a.totalTimeSpent,
      difficulty: a.difficulty,
      topic: a.topic,
      date: a.createdAt,
    }));

    return {
      totalAttempts: attempts.length,
      averageScore: averageScore.toFixed(1),
      bestScore: bestScore.toFixed(1),
      worstScore: worstScore.toFixed(1),
      averageTimePerQuestion: (averageTimePerQuestion / 1000).toFixed(1), // Convert to seconds
      performanceByDifficulty,
      performanceByTopic,
      recentAttempts,
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
}
