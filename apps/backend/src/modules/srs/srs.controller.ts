import { Request, Response, NextFunction } from 'express';
import { SRSService } from './srs.service';

export class SRSController {
  static async review(req: Request, res: Response, next: NextFunction) {
    try {
      const { wordId, quality } = req.body;
      const userId = req.user!.id;
      const item = await SRSService.reviewWord(userId, wordId, quality);
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  static async getDue(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const items = await SRSService.getDueWords(userId);
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }
}
