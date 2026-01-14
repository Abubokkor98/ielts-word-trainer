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
      const timeRange = (req.query.timeRange as '7d' | '30d') || '7d';

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
      const limit = req.query.limit
        ? Number.parseInt(req.query.limit as string, 10)
        : 20;

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
