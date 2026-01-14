import type { NextFunction, Request, Response } from 'express';
import { AdminService } from './admin.service';

export class AdminDashboardController {
  /**
   * Get dashboard metrics with week-over-week comparison
   * GET /api/v1/admin/dashboard-metrics
   */
  static async getDashboardMetrics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const rawTimeRange = req.query.timeRange as string;
      const timeRange: '7d' | '30d' = rawTimeRange === '30d' ? '30d' : '7d';

      const metrics = await AdminService.getDashboardMetrics(timeRange);

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get words with low quiz accuracy
   * GET /api/v1/admin/problem-words
   */
  static async getProblemWords(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const parsedLimit = req.query.limit
        ? Number.parseInt(req.query.limit as string, 10)
        : 20;
      const limit =
        Number.isNaN(parsedLimit) || parsedLimit <= 0 ? 20 : parsedLimit;

      const words = await AdminService.getProblemWords(limit);

      res.json({
        success: true,
        data: {
          words,
          count: words.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
