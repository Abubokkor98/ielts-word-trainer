import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { UserService } from './users.service';
import { QuizAttemptService } from '../quiz/quiz-attempt.service';
import { AppError } from '../../core/errors/AppError';
import { AuthRequest } from '../auth/auth.middleware';

export class UserProfileController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) throw new AppError('Unauthenticated', 401);

      const user = await UserService.findById(authReq.user.id);
      if (!user) throw new AppError('User not found', 404);

      const stats = await QuizAttemptService.getUserStats(authReq.user.id);

      res.json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          xp: user.xp,
          streak: user.streak,
          createdAt: user.createdAt,
          stats,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) throw new AppError('Unauthenticated', 401);

      const user = await UserService.findById(authReq.user.id);
      if (!user) throw new AppError('User not found', 404);

      const { name } = req.body;

      if (name) user.name = name;

      await user.save();

      res.json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) throw new AppError('Unauthenticated', 401);

      const user = await UserService.findById(authReq.user.id);
      if (!user) throw new AppError('User not found', 404);

      const { currentPassword, newPassword } = req.body;

      if (
        !newPassword ||
        typeof newPassword !== 'string' ||
        newPassword.length < 6
      ) {
        throw new AppError('Password must be at least 6 characters', 400);
      }

      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        throw new AppError('Current password is incorrect', 400);
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
