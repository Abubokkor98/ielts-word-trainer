import { Request, Response, NextFunction } from 'express';
import { User } from '../users/users.model';
import { Word } from '../words/words.model';
import { QuizAttempt } from '../quiz/quiz-attempt.model';
import { Quiz } from '../quiz/quiz.entity';
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

  static async createWord(req: Request, res: Response, next: NextFunction) {
    try {
      const word = await Word.create(req.body);
      res.status(201).json({
        success: true,
        data: word,
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

  static async exportUsers(req: Request, res: Response, next: NextFunction) {
    try {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users.csv');

      res.write('name,email,role,xp,createdAt\n');

      const cursor = User.find().sort({ createdAt: -1 }).cursor();

      for (
        let user = await cursor.next();
        user != null;
        user = await cursor.next()
      ) {
        const row = `${user.name},${user.email},${user.role},${
          user.xp
        },${user.createdAt.toISOString()}\n`;
        res.write(row);
      }

      res.end();
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';
      const role = req.query.role as string;

      const skip = (page - 1) * limit;

      const query: any = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      if (role && role !== 'all') {
        query.role = role;
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('-passwordHash'),
        User.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: {
          users,
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

  // Quiz Management Placeholder - Schema for Quiz Definition is missing, assuming simple structure or referencing QuizResult for now is wrong.
  // We need a Quiz model, but currently only QuizAttempt exists.
  // I will implement a basic Quiz Schema stub in the same file or assume it exists in quiz module if I missed it.
  // Wait, I only saw QuizAttempt. Let me check if there is a Quiz definition model.
  // If not, I'll return empty list for now to satisfy the frontend call without crashing.

  static async getQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';
      const skip = (page - 1) * limit;

      const query: any = {};
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      const [quizzes, total] = await Promise.all([
        Quiz.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Quiz.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: {
          quizzes,
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

  static async createQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const quiz = await Quiz.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Quiz created successfully',
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!quiz) {
        throw new AppError('Quiz not found', 404);
      }

      res.json({
        success: true,
        message: 'Quiz updated successfully',
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findByIdAndDelete(id);

      if (!quiz) {
        throw new AppError('Quiz not found', 404);
      }

      res.json({
        success: true,
        message: 'Quiz deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
