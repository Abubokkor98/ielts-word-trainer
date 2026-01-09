import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AdminService } from './admin.service';
import { EmailService } from '../../core/services/email.service';
import { AppError } from '../../core/errors/AppError';
import { Logger } from '@ielts/utils';

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
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

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

      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

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

      res.json({
        success: true,
        message: 'Password has been reset successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
}
