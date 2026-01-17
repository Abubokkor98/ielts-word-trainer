import crypto from 'node:crypto';
import { Logger } from '../../utils';
import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../core/errors/AppError';
import { EmailService } from '../../core/services/email.service';
import { UserService } from '../users/users.service';

export class PasswordResetController {
  static async requestReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await UserService.findByEmail(email);

      if (!user) {
        // Don't reveal if email exists
        return res.json({
          success: true,
          message: 'If that email exists, a reset link has been sent.',
        });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      await EmailService.sendPasswordResetEmail(email, resetToken, user.role);

      res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent.',
      });
    } catch (error) {
      Logger.error(`Password reset request failed: ${error}`);
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

      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await UserService.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Password has been reset successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
}
