import { Request, Response, NextFunction } from 'express';
import { User } from '../users/users.model';
import { Word } from '../words/words.model';
import { QuizAttempt } from '../quiz/quiz-attempt.model';
import { CSVImportService } from './csv-import.service';
import { AppError } from '../../core/errors/AppError';

export class AdminController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalUsers, totalWords, totalQuizAttempts, recentUsers] =
        await Promise.all([
          User.countDocuments(),
          Word.countDocuments(),
          QuizAttempt.countDocuments(),
          User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt xp'),
        ]);

      const wordsByDifficulty = await Word.aggregate([
        { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      ]);

      const quizStats = await QuizAttempt.aggregate([
        {
          $group: {
            _id: null,
            totalQuestions: { $sum: '$totalQuestions' },
            totalCorrect: { $sum: '$score' },
            avgScore: {
              $avg: {
                $multiply: [{ $divide: ['$score', '$totalQuestions'] }, 100],
              },
            },
          },
        },
      ]);

      res.json({
        success: true,
        data: {
          totalUsers,
          totalWords,
          totalQuizAttempts,
          wordsByDifficulty,
          quizStats: quizStats[0] || {
            totalQuestions: 0,
            totalCorrect: 0,
            avgScore: 0,
          },
          recentUsers,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getWords(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';
      const difficulty = req.query.difficulty as string;

      const skip = (page - 1) * limit;

      const query: any = {};
      if (search) {
        query.word = { $regex: search, $options: 'i' };
      }
      if (difficulty && difficulty !== 'all') {
        query.difficulty = difficulty;
      }

      const [words, total] = await Promise.all([
        Word.find(query).sort({ word: 1 }).skip(skip).limit(limit),
        Word.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: {
          words,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteWord(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const word = await Word.findByIdAndDelete(id);
      if (!word) {
        throw new AppError('Word not found', 404);
      }

      res.json({
        success: true,
        message: 'Word deleted successfully',
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
