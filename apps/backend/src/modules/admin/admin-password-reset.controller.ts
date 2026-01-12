import { Logger } from '@ielts/utils';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../core/errors/AppError';
import { EmailService } from '../../core/services/email.service';
import { AdminService } from './admin.service';

export class AdminPasswordResetController {
  static async requestReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const admin = await AdminService.findByEmail(email);

      if (!admin) {
        // Don't reveal if email exists
        return res.json({
          success: true,
          message: 'If that email exists, a reset link has been sent.',
        });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      admin.resetPasswordToken = hashedToken;
      admin.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await admin.save();

      await EmailService.sendPasswordResetEmail(email, resetToken, 'admin');

      res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent.',
      });
    } catch (error) {
      Logger.error(`Admin password reset request failed: ${error}`);
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;

      if (!token || typeof token !== 'string') {
        throw new AppError('Reset token is required', 400);
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        throw new AppError('Password must be at least 6 characters', 400);
      }

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const admin = await AdminService.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!admin) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      const salt = await bcrypt.genSalt(10);
      admin.passwordHash = await bcrypt.hash(password, salt);
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpires = undefined;
      await admin.save();

      Logger.info(`Admin password reset successful for: ${admin.email}`);

      res.json({
        success: true,
        message: 'Password has been reset successfully.',
      });
    } catch (error) {
      Logger.error(`Admin password reset failed: ${error}`);
      next(error);
    }
  }
}
