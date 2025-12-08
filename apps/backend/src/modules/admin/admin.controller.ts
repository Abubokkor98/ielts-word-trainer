import { Request, Response, NextFunction } from 'express';
import { User } from '../users/users.model';
import { Word } from '../words/words.model';
import { QuizAttempt } from '../quiz/quiz-attempt.model';
import { CSVImportService } from './csv-import.service';
import { AppError } from '../../core/errors/AppError';

export class AdminController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const totalUsers = await User.countDocuments();
      const totalWords = await Word.countDocuments();
      const totalQuizzes = await QuizAttempt.countDocuments();

      res.json({
        success: true,
        data: {
          totalUsers,
          totalWords,
          totalQuizzes,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadWords(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const csvContent = req.file.buffer.toString('utf-8');
      const results = await CSVImportService.importWords(csvContent);

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  static async downloadTemplate(req: Request, res: Response) {
    const template = CSVImportService.generateTemplate();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=vocabulary-template.csv'
    );
    res.send(template);
  }
}
