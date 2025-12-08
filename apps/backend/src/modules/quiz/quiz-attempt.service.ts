import { QuizAttempt, IQuizAttempt } from './quiz-attempt.model';

export class QuizAttemptService {
  static async createAttempt(
    data: Partial<IQuizAttempt>
  ): Promise<IQuizAttempt> {
    const attempt = new QuizAttempt(data);
    return attempt.save();
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
      ...attempts.map((a) => (a.score / a.totalQuestions) * 100)
    );

    return {
      totalAttempts: attempts.length,
      averageScore: totalScore / attempts.length,
      averageTimePerQuestion: totalTime / totalQuestions,
      bestScore,
    };
  }
}
