import { Request, Response, NextFunction } from 'express';
import { QuizService } from './quiz.service';
import { QuizAnalyticsService } from './quiz-analytics.service';

export class QuizController {
  static async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { topicId, difficulty, limit } = req.query;
      // Expecting optional user for public generation
      const userId = req.user?.id;

      const quiz = await QuizService.generateQuiz(
        userId,
        topicId as string,
        difficulty as string,
        limit ? parseInt(limit as string) : 10
      );
      res.json({ success: true, data: quiz });
    } catch (err) {
      next(err);
    }
  }

  static async getRecommendedDifficulty(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const result = await QuizAnalyticsService.getRecommendedDifficulty(
        userId
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
