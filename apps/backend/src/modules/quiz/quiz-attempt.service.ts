import { type IQuizAttempt, QuizAttempt } from './quiz-attempt.model';
import { SRSService } from '../srs/srs.service';
import { User } from '../users/users.model';

export class QuizAttemptService {
  static async createAttempt(
    data: Partial<IQuizAttempt>
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
        const lastQuiz = user.lastQuizDate ? new Date(user.lastQuizDate) : null;

        // Reset time component for accurate day comparison
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        if (lastQuiz) {
          const lastQuizDay = new Date(
            lastQuiz.getFullYear(),
            lastQuiz.getMonth(),
            lastQuiz.getDate()
          );
          const diffTime = Math.abs(today.getTime() - lastQuizDay.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            // Consecutive day
            user.streak = (user.streak || 0) + 1;
          } else if (diffDays > 1) {
            // Missed a day or more
            user.streak = 1;
          }
          // If diffDays === 0 (same day), do nothing to streak
        } else {
          // First quiz ever
          user.streak = 1;
        }

        // Calculate XP (10 per score point)
        const xpEarned = (data.score || 0) * 10;
        user.xp = (user.xp || 0) + xpEarned;

        user.lastQuizDate = now;
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
