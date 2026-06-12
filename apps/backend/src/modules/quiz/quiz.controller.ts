import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '../auth/auth.middleware';
import { QuizService } from './quiz.service';
import { QuizAnalyticsService } from './quiz-analytics.service';
import { UserService } from '../users/users.service';
import { StreakUtils } from '../users/streak-utils';
import { AppError } from '../../core/errors/AppError';
import type { RequestWithTimezone } from '../../middleware/request-with-timezone';

export class QuizController {
  static async generate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { topicId, difficulty, limit } = req.query;
      // Expecting optional user for public generation
      const userId = req.user?.id;

      if (userId) {
        const user = await UserService.findById(userId);
        if (user && !user.isEmailVerified && user.lastQuizDate) {
          const userTimezone = (req as RequestWithTimezone).userTimezone || 'UTC';
          const lastQuizDay = StreakUtils.getUserCalendarDay(userTimezone, user.lastQuizDate);
          const today = StreakUtils.getUserCalendarDay(userTimezone, new Date());
          const daysDiff = StreakUtils.getDaysDifference(lastQuizDay, today);

          if (daysDiff === 0) {
            throw new AppError('Unverified users can only take 1 quiz per day. Please verify your email to unlock unlimited quizzes.', 403);
          }
        }
      }

      const quiz = await QuizService.generateQuiz(
        userId,
        topicId as string,
        difficulty as string,
        limit ? parseInt(limit as string, 10) : 10,
      );
      res.json({ success: true, data: quiz });
    } catch (err) {
      next(err);
    }
  }

  static async getRecommendedDifficulty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const result = await QuizAnalyticsService.getRecommendedDifficulty(userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
