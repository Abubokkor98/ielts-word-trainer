import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../core/errors/AppError';
import type { RequestWithTimezone } from '../../middleware/request-with-timezone';
import type { AuthRequest } from '../auth/auth.middleware';
import { QuizAttemptService } from '../quiz/quiz-attempt.service';
import cloudinary from '../../config/cloudinary';
import { StreakUtils } from './streak-utils';
import { UserService } from './users.service';
import { Logger } from '../../utils';

export class UserProfileController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) throw new AppError('Unauthenticated', 401);

      const user = await UserService.findById(authReq.user.id);
      if (!user) throw new AppError('User not found', 404);

      // Check if streak needs reset (passive detection)
      const userTimezone =
        (req as RequestWithTimezone).userTimezone || user.timezone || 'UTC';

      //  OPTIMIZATION: Only check streak if we haven't checked today
      if (
        StreakUtils.shouldCheckStreak(userTimezone, user.lastStreakCheckDate)
      ) {
        // Only run check if we haven't checked today
        const { needsReset, newStreak } = StreakUtils.checkAndResetStreak(
          userTimezone,
          user.lastQuizDate,
          user.lastReviewDate,
          user.streak
        );

        if (needsReset) {
          user.streak = newStreak;
        }

        user.lastStreakCheckDate = new Date(); // Mark as checked today
        user.timezone = userTimezone;
        await user.save();
      }

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
          profilePictureUrl: user.profilePictureUrl,
          isEmailVerified: user.isEmailVerified,
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

      const { name, profilePictureUrl, profilePictureId } = req.body;
      const expectedPublicId = `user_${authReq.user.id}`;

      if (name) user.name = name;

      if (
        profilePictureId !== undefined &&
        profilePictureId !== null &&
        profilePictureId !== expectedPublicId
      ) {
        throw new AppError('Invalid profilePictureId', 400);
      }

      // Clean up old picture if a new one is being set
      if (profilePictureId && user.profilePictureId && user.profilePictureId !== profilePictureId) {
        try {
          await cloudinary.uploader.destroy(user.profilePictureId);
        } catch (error) {
          console.error('Failed to delete old profile picture from Cloudinary:', error);
        }
      }

      if (profilePictureUrl !== undefined) user.profilePictureUrl = profilePictureUrl;
      if (profilePictureId !== undefined) user.profilePictureId = profilePictureId;

      await user.save();

      res.json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePictureUrl: user.profilePictureUrl,
          isEmailVerified: user.isEmailVerified,
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

      if (!user.isEmailVerified) {
        throw new AppError('Email verification is required to change password', 403);
      }

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

  static async getUploadSignature(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authReq = req as AuthRequest;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!apiSecret) {
        throw new AppError('Cloudinary configuration is missing', 500);
      }

      // Industry Best Practice: Hardcode allowed parameters on the backend
      // instead of blindly trusting the client's payload.
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign = {
        timestamp,
        folder: 'profile_pictures',
        public_id: `user_${authReq.user.id}`,
        overwrite: true,
        invalidate: true,
      };
      
      Logger.info(`Generating Cloudinary signature for user: ${authReq.user.id}`);
      
      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        apiSecret
      );

      Logger.info(`Successfully generated Cloudinary signature for public_id: ${paramsToSign.public_id}`);

      res.json({ signature, timestamp, publicId: paramsToSign.public_id });
    } catch (error) {
      Logger.error(`Error generating Cloudinary signature: ${error}`);
      next(error);
    }
  }

  static async deleteProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) throw new AppError('Unauthenticated', 401);

      const user = await UserService.findById(authReq.user.id);
      if (!user) throw new AppError('User not found', 404);

      if (user.profilePictureId) {
        await cloudinary.uploader.destroy(user.profilePictureId);
      }

      user.profilePictureUrl = undefined;
      user.profilePictureId = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Profile picture removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
