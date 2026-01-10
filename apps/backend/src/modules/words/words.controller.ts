import { Request, Response, NextFunction } from 'express';
import { WordsService } from './words.service';
import { AppError } from '../../core/errors/AppError';
import { CSVImportService } from '../admin/csv-import.service';

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

  static async uploadCSV(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('No file provided', 400);
      }

      // Convert buffer to string
      const csvContent = req.file.buffer.toString('utf-8');

      // Import words using the existing service
      const results = await CSVImportService.importWords(csvContent);

      // Return detailed results
      res.status(200).json({
        success: true,
        data: results,
        message: `Import completed: ${results.successful} successful, ${results.failed} failed`,
      });
    } catch (err) {
      next(err);
    }
  }
}
