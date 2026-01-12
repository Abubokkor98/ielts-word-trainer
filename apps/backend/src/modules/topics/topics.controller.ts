import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../core/errors/AppError';
import { TopicsService } from './topics.service';

export class TopicsController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const topic = await TopicsService.create(req.body);
      res.status(201).json({ success: true, data: topic });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const topics = await TopicsService.findAll();
      res.json({ success: true, data: topics });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const topic = await TopicsService.update(req.params.id, req.body);
      if (!topic) throw new AppError('Topic not found', 404);
      res.json({ success: true, data: topic });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await TopicsService.delete(req.params.id);
      res.json({ success: true, message: 'Topic deleted' });
    } catch (err) {
      next(err);
    }
  }
}
