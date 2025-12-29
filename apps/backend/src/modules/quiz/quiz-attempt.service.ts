import { QuizAttempt, IQuizAttempt } from './quiz-attempt.model';

export class QuizAttemptService {
  static async createAttempt(
    data: Partial<IQuizAttempt>
  ): Promise<IQuizAttempt> {
    const attempt = new QuizAttempt(data);
    await attempt.save();

    // Update SRS for each word
    const { SRSService } = await import('../srs/srs.service');

    if (data.questions && data.userId) {
      for (const question of data.questions) {
        // Use quality rating from frontend (speed-based: 0, 3, 4, 5)
        // If not provided, fall back to simple logic: Correct = 3, Incorrect = 0
        const quality = question.qualityRating ?? (question.isCorrect ? 3 : 0);

        await SRSService.reviewWord(
          data.userId.toString(),
          question.wordId.toString(),
          quality
        );
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
