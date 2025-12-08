import { Request, Response, NextFunction } from 'express';
import { QuizAnalyticsService } from './quiz-analytics.service';
import { AppError } from '../../core/errors/AppError';

export class QuizAnalyticsController {
  static async getUserAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) throw new AppError('Unauthenticated', 401);

      const analytics = await QuizAnalyticsService.getUserAnalytics(
        req.user.id
      );

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getGlobalAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const analytics = await QuizAnalyticsService.getGlobalAnalytics();

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }
}
