import type { NextFunction, Request, Response } from 'express';
import type { AuthRequest } from '../auth/auth.middleware';
import { SRSService } from './srs.service';

export class SRSController {
  static async review(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const { wordId, quality } = req.body;
      const userId = authReq.user!.id;
      const item = await SRSService.reviewWord(userId, wordId, quality);
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  static async getDue(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const items = await SRSService.getDueWords(userId);
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const stats = await SRSService.getStats(userId);
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }

  static async getWordStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { wordId } = req.params;
      const status = await SRSService.getWordStatus(userId, wordId);
      res.json({ success: true, data: status });
    } catch (err) {
      next(err);
    }
  }

  static async getSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const days = parseInt(req.query.days as string) || 7;
      const schedule = await SRSService.getReviewSchedule(userId, days);
      res.json({ success: true, data: schedule });
    } catch (err) {
      next(err);
    }
  }
}
