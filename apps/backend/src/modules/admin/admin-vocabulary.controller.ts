import type { NextFunction, Request, Response } from 'express';
import { AdminVocabularyService } from './admin-vocabulary.service';

// Maximum allowed limit to prevent expensive queries
const MAX_LIMIT = 200;

export class AdminVocabularyController {
  /**
   * Get comprehensive vocabulary overview metrics
   * GET /api/v1/admin/vocabulary/overview
   */
  static async getOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const overview = await AdminVocabularyService.getVocabularyOverview();

      res.json({
        success: true,
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get top performing words (>= 80% accuracy)
   * GET /api/v1/admin/vocabulary/top-words?limit=20
   */
  static async getTopWords(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedLimit = req.query.limit
        ? Number.parseInt(req.query.limit as string, 10)
        : 20;
      const limit =
        Number.isNaN(parsedLimit) || parsedLimit <= 0
          ? 20
          : Math.min(parsedLimit, MAX_LIMIT);

      const topWords = await AdminVocabularyService.getTopWords(limit);

      res.json({
        success: true,
        data: {
          words: topWords,
          count: topWords.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get words with no quiz attempts
   * GET /api/v1/admin/vocabulary/unused-words?limit=50
   */
  static async getUnusedWords(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedLimit = req.query.limit
        ? Number.parseInt(req.query.limit as string, 10)
        : 50;
      const limit =
        Number.isNaN(parsedLimit) || parsedLimit <= 0
          ? 50
          : Math.min(parsedLimit, MAX_LIMIT);

      const { words, totalCount } = await AdminVocabularyService.getUnusedWords(
        limit
      );

      res.json({
        success: true,
        data: {
          words,
          count: totalCount, // Total count, not words.length
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get word usage statistics (most and least reviewed)
   * GET /api/v1/admin/vocabulary/usage-stats?limit=20
   */
  static async getUsageStats(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedLimit = req.query.limit
        ? Number.parseInt(req.query.limit as string, 10)
        : 20;
      const limit =
        Number.isNaN(parsedLimit) || parsedLimit <= 0
          ? 20
          : Math.min(parsedLimit, MAX_LIMIT);

      const usageStats = await AdminVocabularyService.getUsageStats(limit);

      res.json({
        success: true,
        data: usageStats,
      });
    } catch (error) {
      next(error);
    }
  }
}
