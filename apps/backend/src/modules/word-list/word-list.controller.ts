import type { NextFunction, Request, Response } from 'express';
import type { AuthRequest } from '../auth/auth.middleware';
import { WordListService } from './word-list.service';

export class WordListController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const lists = await WordListService.getUserLists(userId);
      res.json({ success: true, data: lists });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const { name } = req.body;
      const list = await WordListService.createList(userId, name);
      res.status(201).json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }

  static async rename(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const { listId } = req.params;
      const { name } = req.body;
      const list = await WordListService.renameList(userId, listId, name);
      res.json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const { listId } = req.params;
      await WordListService.deleteList(userId, listId);
      res.json({ success: true, message: 'List deleted' });
    } catch (err) {
      next(err);
    }
  }

  static async addWord(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const { listId } = req.params;
      const { wordId } = req.body;
      const list = await WordListService.addWord(userId, listId, wordId);
      res.json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }

  static async removeWord(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const { listId, wordId } = req.params;
      const list = await WordListService.removeWord(userId, listId, wordId);
      res.json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }
}
