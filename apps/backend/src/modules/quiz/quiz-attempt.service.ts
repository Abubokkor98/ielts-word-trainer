import { SRSService } from '../srs/srs.service';
import { User } from '../users/users.model';
import { StreakUtils } from '../users/streak-utils';
import { type IQuizAttempt, QuizAttempt } from './quiz-attempt.model';

export class QuizAttemptService {
  static async createAttempt(
    data: Partial<IQuizAttempt>,
    userTimezone?: string // No default - let service handle fallback
  ): Promise<IQuizAttempt> {
    const attempt = new QuizAttempt(data);
    await attempt.save();

    // Update SRS for each word

    // Lazy load User model to avoid circular dependency issues if any

    if (data.questions && data.userId) {
      // Optimize: Use bulk review instead of loop
      const reviews = data.questions.map((q) => ({
        wordId: q.wordId.toString(),
        quality: q.qualityRating ?? (q.isCorrect ? 3 : 0),
      }));

      await SRSService.bulkReview(data.userId.toString(), reviews);

      // Update User Activity & Streak
      const user = await User.findById(data.userId);
      if (user) {
        const now = new Date();

        // Use header timezone, fall back to stored timezone, then UTC
        const effectiveTimezone = userTimezone || user.timezone || 'UTC';

        // Use centralized timezone-aware streak logic
        const { newStreak } = StreakUtils.updateStreakOnQuiz(
          effectiveTimezone,
          user.lastQuizDate,
          user.lastReviewDate,
          user.streak
        );
        user.streak = newStreak;

        // Calculate XP (10 per score point)
        const xpEarned = (data.score || 0) * 10;
        user.xp = (user.xp || 0) + xpEarned;

        user.lastQuizDate = now;
        user.timezone = effectiveTimezone; // Preserve stored tz if header missing
        await user.save();
      }
    }

    return attempt;
  }

  static async getUserAttempts(
    userId: string,
    limit = 10
  ): Promise<IQuizAttempt[]> {
    return QuizAttempt.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('questions.wordId', 'word meaning');
  }

  static async getUserStats(userId: string) {
    const attempts = await QuizAttempt.find({ userId });

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        averageTimePerQuestion: 0,
        bestScore: 0,
      };
    }

    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
    const totalTime = attempts.reduce((sum, a) => sum + a.totalTimeSpent, 0);
    const totalQuestions = attempts.reduce(
      (sum, a) => sum + a.totalQuestions,
      0
    );
    const bestScore = Math.max(
      ...attempts.map((a) =>
        a.totalQuestions > 0 ? (a.score / a.totalQuestions) * 100 : 0
      )
    );

    return {
      totalAttempts: attempts.length,
      averageScore: totalScore / attempts.length,
      averageTimePerQuestion:
        totalQuestions > 0 ? totalTime / totalQuestions : 0,
      bestScore,
    };
  }
}
