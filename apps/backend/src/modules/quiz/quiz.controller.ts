import { Request, Response, NextFunction } from 'express';
import { QuizService } from './quiz.service';

export class QuizController {
  static async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { topicId, difficulty, limit } = req.query;
      const quiz = await QuizService.generateQuiz(
        topicId as string,
        difficulty as string,
        limit ? parseInt(limit as string) : 10
      );
      res.json({ success: true, data: quiz });
    } catch (err) {
      next(err);
    }
  }
}
