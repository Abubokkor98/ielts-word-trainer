import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '../auth/auth.middleware';
import { FeedbackService } from './feedback.service';
import { AppError } from '../../core/errors/AppError';

export class FeedbackController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        throw new AppError('Unauthorized: Must be logged in to submit feedback', 401);
      }

      const feedback = await FeedbackService.create({
        ...req.body,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: feedback,
        message: 'Feedback submitted successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 20, 1), 100);
      const filters = {
        feedbackType: req.query.feedbackType as string,
        status: req.query.status as string,
      };

      const result = await FeedbackService.findAll(filters, page, limit);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['new', 'reviewed', 'resolved'].includes(status)) {
        throw new AppError('Invalid feedback status value', 400);
      }

      const updated = await FeedbackService.updateStatus(id, status);
      if (!updated) {
        throw new AppError('Feedback record not found', 404);
      }

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Feedback status updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await FeedbackService.delete(id);

      if (!deleted) {
        throw new AppError('Feedback record not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Feedback record deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}
