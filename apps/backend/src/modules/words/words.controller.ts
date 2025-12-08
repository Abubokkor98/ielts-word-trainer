import { Request, Response, NextFunction } from 'express';
import { WordsService } from './words.service';
import { AppError } from '../../core/errors/AppError';

export class WordsController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const word = await WordsService.create(req.body);
      res.status(201).json({ success: true, data: word });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await WordsService.findAll(req.query, page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const word = await WordsService.findById(req.params.id);
      if (!word) throw new AppError('Word not found', 404);
      res.json({ success: true, data: word });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const word = await WordsService.update(req.params.id, req.body);
      if (!word) throw new AppError('Word not found', 404);
      res.json({ success: true, data: word });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await WordsService.delete(req.params.id);
      res.json({ success: true, message: 'Word deleted' });
    } catch (err) {
      next(err);
    }
  }
}
