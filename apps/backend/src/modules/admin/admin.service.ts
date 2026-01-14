import bcrypt from 'bcryptjs';
import { AppError } from '../../core/errors/AppError';
import { QuizAttempt } from '../quiz/quiz-attempt.model';
import { User } from '../users/users.model';
import { Word } from '../words/words.model';
import { Admin, type IAdmin } from './admin.model';
import {
  AlertAction,
  AlertSeverity,
  type DashboardAlert,
  type DashboardMetrics,
  type ProblemWord,
} from './admin.types';

export class AdminService {
  static async createAdmin(data: Partial<IAdmin>, password?: string): Promise<IAdmin> {
    // If password is provided as separate argument, hash it
    let passwordHash = data.passwordHash;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    if (!passwordHash) {
      throw new AppError('Password is required', 400);
    }

    const admin = new Admin({
      ...data,
      passwordHash,
    });
    return admin.save();
  }

  static async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email });
  }

  static async findOne(query: Record<string, unknown>): Promise<IAdmin | null> {
    return Admin.findOne(query);
  }

  static async findById(id: string): Promise<IAdmin | null> {
    return Admin.findById(id);
  }

  static async findAll(): Promise<IAdmin[]> {
    return Admin.find({}, '-passwordHash -refreshToken');
  }

  static async deleteAdmin(id: string): Promise<void> {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }
  }

  static async updateAdmin(id: string, data: Partial<IAdmin>): Promise<IAdmin | null> {
    return Admin.findByIdAndUpdate(id, data, { new: true });
  }

  static async getDashboardStats() {
    const [totalUsers, totalWords, totalQuizAttempts, wordsByDifficulty, quizStats] =
      await Promise.all([
        User.countDocuments(),
        Word.countDocuments(),
        QuizAttempt.countDocuments(),
        Word.aggregate([{ $group: { _id: '$difficulty', count: { $sum: 1 } } }]),
        QuizAttempt.aggregate([
          {
            $group: {
              _id: null,
              avgScore: {
                $avg: {
                  $multiply: [{ $divide: ['$score', '$totalQuestions'] }, 100],
                },
              },
            },
          },
        ]),
      ]);

    return {
      totalUsers,
      totalWords,
      totalQuizAttempts,
      wordsByDifficulty,
      quizStats: quizStats[0] || { avgScore: 0 },
    };
  }

  static async getUsers(page: number, limit: number, search?: string) {
    const query: Record<string, unknown> = {};

    if (search) {
      // Escape special characters to prevent ReDoS
      const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: 'i' } },
        { email: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateUserStatus(userId: string, status: string) {
    return User.findByIdAndUpdate(userId, { status }, { new: true });
  }

  static async updatePassword(id: string, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await Admin.findByIdAndUpdate(id, { passwordHash });
  }

  /**
   * Get dashboard metrics with week-over-week comparison
   * Uses MongoDB aggregations for optimal performance
   */
  static async getDashboardMetrics(timeRange: '7d' | '30d' = '7d'): Promise<DashboardMetrics> {
    const daysAgo = timeRange === '7d' ? 7 : 30;
    const currentStart = new Date();
    currentStart.setDate(currentStart.getDate() - daysAgo);
    currentStart.setHours(0, 0, 0, 0);

    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - daysAgo);

    const previousEnd = new Date(currentStart);

    // Use Promise.all for parallel execution of all aggregations
    const [
      activeUsersCurrent,
      activeUsersPrevious,
      activeLearnersCurrent,
      activeLearnersPrevious,
      newUsersCurrent,
      newUsersPrevious,
      quizStatsCurrent,
      quizStatsPrevious,
      dailyActiveUsers,
    ] = await Promise.all([
      // Active USERS (current) - Login Activity (lastLoginAt)
      User.countDocuments({ lastLoginAt: { $gte: currentStart } }),

      // Active USERS (previous)
      User.countDocuments({
        lastLoginAt: { $gte: previousStart, $lt: previousEnd },
      }),

      // Active LEARNERS (current) - Took a quiz
      User.countDocuments({ lastQuizDate: { $gte: currentStart } }),

      // Active LEARNERS (previous)
      User.countDocuments({
        lastQuizDate: { $gte: previousStart, $lt: previousEnd },
      }),

      // New users (current period)
      User.countDocuments({ createdAt: { $gte: currentStart } }),

      // New users (previous period)
      User.countDocuments({
        createdAt: { $gte: previousStart, $lt: previousEnd },
      }),

      // Quiz stats (current period)
      QuizAttempt.aggregate([
        { $match: { createdAt: { $gte: currentStart } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: 1 }, // Assuming all saved attempts are completed
            totalScore: { $sum: '$score' },
            totalQuestions: { $sum: '$totalQuestions' },
          },
        },
      ]),

      // Quiz stats (previous period)
      QuizAttempt.aggregate([
        { $match: { createdAt: { $gte: previousStart, $lt: previousEnd } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: 1 },
            totalScore: { $sum: '$score' },
            totalQuestions: { $sum: '$totalQuestions' },
          },
        },
      ]),

      // Daily Active Users (Last 7 days)
      User.aggregate<{ _id: string; date: string; count: number }>([
        { $match: { updatedAt: { $gte: currentStart } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { date: '$_id', count: 1, _id: 0 } },
      ]),
    ]);

    // Calculate Percent Changes
    const calculatePercentChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const currentQuizStats = quizStatsCurrent[0] || {
      total: 0,
      completed: 0,
      totalScore: 0,
      totalQuestions: 0,
    };
    const previousQuizStats = quizStatsPrevious[0] || {
      total: 0,
      completed: 0,
      totalScore: 0,
      totalQuestions: 0,
    };

    const currentAvgScore =
      currentQuizStats.totalQuestions > 0
        ? (currentQuizStats.totalScore / currentQuizStats.totalQuestions) * 100
        : 0;
    const previousAvgScore =
      previousQuizStats.totalQuestions > 0
        ? (previousQuizStats.totalScore / previousQuizStats.totalQuestions) * 100
        : 0;

    const currentCompletionRate =
      currentQuizStats.total > 0 ? (currentQuizStats.completed / currentQuizStats.total) * 100 : 0;
    const previousCompletionRate =
      previousQuizStats.total > 0
        ? (previousQuizStats.completed / previousQuizStats.total) * 100
        : 0;

    // Construct Response
    const metrics: DashboardMetrics = {
      activeUsers: {
        current: activeUsersCurrent,
        previous: activeUsersPrevious,
        percentChange: calculatePercentChange(activeUsersCurrent, activeUsersPrevious),
      },
      activeLearners: {
        current: activeLearnersCurrent,
        previous: activeLearnersPrevious,
        percentChange: calculatePercentChange(activeLearnersCurrent, activeLearnersPrevious),
      },
      newUsers: {
        current: newUsersCurrent,
        previous: newUsersPrevious,
        percentChange: calculatePercentChange(newUsersCurrent, newUsersPrevious),
      },
      quizCompletionRate: {
        current: currentCompletionRate,
        previous: previousCompletionRate,
        percentChange: calculatePercentChange(currentCompletionRate, previousCompletionRate),
      },
      avgQuizScore: {
        current: currentAvgScore,
        previous: previousAvgScore,
        percentChange: calculatePercentChange(currentAvgScore, previousAvgScore),
      },
      dailyActiveUsers: dailyActiveUsers.map((d) => ({
        date: d.date,
        count: d.count,
      })),
      alerts: [], // Generated below
    };

    // Generate alerts based on thresholds
    metrics.alerts = AdminService.generateAlerts(metrics);

    return metrics;
  }

  /**
   * Generate alerts based on metric thresholds
   */
  private static generateAlerts(metrics: DashboardMetrics): DashboardAlert[] {
    const alerts: DashboardAlert[] = [];

    // Alert: Quiz completion rate issues
    if (metrics.quizCompletionRate.current < 50) {
      alerts.push({
        severity: AlertSeverity.CRITICAL,
        message: 'Quiz completion rate critically low (<50%)',
        action: AlertAction.CHECK_QUIZ_UX,
      });
    } else if (
      metrics.quizCompletionRate.current < 65 ||
      metrics.quizCompletionRate.percentChange < -10
    ) {
      alerts.push({
        severity: AlertSeverity.WARNING,
        message: `Quiz completion dropped ${Math.abs(
          metrics.quizCompletionRate.percentChange,
        ).toFixed(1)}% - investigate dropout`,
        action: AlertAction.CHECK_QUIZ_UX,
      });
    }

    // Alert: New user acquisition dropped
    if (metrics.newUsers.percentChange < -20) {
      alerts.push({
        severity: AlertSeverity.WARNING,
        message: 'User acquisition dropped >20% - check marketing/onboarding',
        action: AlertAction.REVIEW_ACQUISITION,
      });
    }

    // Alert: Active users issues
    if (metrics.activeUsers.current < 100) {
      alerts.push({
        severity: AlertSeverity.CRITICAL,
        message: 'Active users below 100 - engagement issue',
        action: AlertAction.REVIEW_RETENTION,
      });
    } else if (metrics.activeUsers.percentChange < -20) {
      alerts.push({
        severity: AlertSeverity.WARNING,
        message: `Active users dropped ${Math.abs(metrics.activeUsers.percentChange).toFixed(1)}%`,
        action: AlertAction.REVIEW_RETENTION,
      });
    }

    return alerts;
  }

  /**
   * Get words with low quiz accuracy (<40%)
   * Uses aggregation pipeline for optimal performance
   */
  static async getProblemWords(limit = 20): Promise<ProblemWord[]> {
    // Aggregate quiz attempts to find words with low accuracy
    const problemWordsAggregation = await QuizAttempt.aggregate([
      // Unwind questions array to process each question separately
      { $unwind: '$questions' },

      // Group by wordId to calculate stats
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

      // Calculate accuracy percentage
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

      // Filter: accuracy < 40% AND attempts >= 10 (statistical significance)
      {
        $match: {
          accuracy: { $lt: 40 },
          attempts: { $gte: 10 },
        },
      },

      // Sort by accuracy ascending (worst first)
      { $sort: { accuracy: 1 } },

      // Limit to top N problem words
      { $limit: limit },
    ]);

    // Get word details for the problem words
    const wordIds = problemWordsAggregation.map((w) => w.wordId);

    if (wordIds.length === 0) {
      return [];
    }

    const words = await Word.find({ _id: { $in: wordIds } }).lean();

    // Merge aggregation results with word details
    return problemWordsAggregation.map((pw) => {
      const word = words.find((w) => w._id.toString() === pw.wordId.toString());

      return {
        wordId: pw.wordId.toString(),
        word: word?.word || 'Unknown',
        meaning: word?.meaning || '',
        difficulty: word?.difficulty || 'beginner',
        accuracy: Math.round(pw.accuracy * 10) / 10, // Round to 1 decimal
        attempts: pw.attempts,
        lastUpdated: word?.updatedAt,
      } as ProblemWord;
    });
  }
}
