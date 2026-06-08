import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../core/errors/AppError';
import type { RequestWithTimezone } from '../../middleware/request-with-timezone';
import { clearAuthCookies, setAuthCookies } from '../../shared/cookies';
import { StreakUtils } from '../users/streak-utils';
import { UserService } from '../users/users.service';
import type { AuthRequest } from './auth.middleware';
import { AuthService } from './auth.service';
import crypto from 'node:crypto';
import { EmailService } from '../../core/services/email.service';
import { agenda } from '../../config/agenda';
export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const existingUser = await UserService.findByEmail(req.body.email);
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }

      const user = await UserService.createUser(req.body);
      const { accessToken, refreshToken } = await AuthService.generateTokens(
        user
      );

      setAuthCookies(res, accessToken, refreshToken);

      res.status(201).json({
        success: true,
        accessToken,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePictureUrl: user.profilePictureUrl,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await UserService.findByEmail(email);

      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check ban status before password validation to prevent information disclosure
      if (user.status === 'banned') {
        throw new AppError(
          'Your account has been banned. Please contact support.',
          403
        );
      }

      const isValid = await AuthService.validatePassword(
        password,
        user.passwordHash
      );

      if (!isValid) {
        throw new AppError('Invalid email or password', 401);
      }

      const { accessToken, refreshToken } = await AuthService.generateTokens(
        user
      );

      setAuthCookies(res, accessToken, refreshToken);

      res.status(200).json({
        success: true,
        accessToken,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePictureUrl: user.profilePictureUrl,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) throw new AppError('Unauthenticated', 401);
      const user = await UserService.findById(authReq.user.id);
      if (!user) throw new AppError('User not found', 404);

      // Check if streak needs reset (passive detection)
      const userTimezone =
        (req as RequestWithTimezone).userTimezone || user.timezone || 'UTC';

      // OPTIMIZATION: Only check streak if we haven't checked today
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

      res.json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          xp: user.xp,
          streak: user.streak,
          lastQuizDate: user.lastQuizDate,
          profilePictureUrl: user.profilePictureUrl,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        const error = new AppError('Refresh token not found', 401);
        (error as any).code = 'REFRESH_TOKEN_MISSING';
        throw error;
      }

      // Verify refresh token
      const decoded = await AuthService.verifyToken(refreshToken);
      const user = await UserService.findById(decoded.id);

      if (!user) {
        const error = new AppError('User not found', 401);
        (error as any).code = 'USER_NOT_FOUND';
        throw error;
      }

      if (user.status === 'banned') {
        const error = new AppError(
          'Your account has been banned. Please contact support.',
          403
        );
        (error as any).code = 'USER_BANNED';
        throw error;
      }

      // Check if refresh token exists in user's token list
      let tokenValid = false;
      for (const storedToken of user.refreshToken) {
        const isMatch = await AuthService.validatePassword(
          refreshToken,
          storedToken
        );
        if (isMatch) {
          tokenValid = true;
          break;
        }
      }

      if (!tokenValid) {
        const error = new AppError('Invalid refresh token', 401);
        (error as any).code = 'INVALID_REFRESH_TOKEN';
        throw error;
      }

      // Remove old refresh token first
      await AuthService.logout(user, refreshToken);

      // Token rotation: Generate new tokens after invalidating old refresh token
      const { accessToken, refreshToken: newRefreshToken } =
        await AuthService.generateTokens(user);

      setAuthCookies(res, accessToken, newRefreshToken);

      res.json({
        success: true,
        accessToken,
      });
    } catch (err: any) {
      // Clear cookies only for auth-related errors, not server errors
      const authErrorCodes = [
        'REFRESH_TOKEN_MISSING',
        'USER_NOT_FOUND',
        'USER_BANNED',
        'INVALID_REFRESH_TOKEN',
      ];
      const isAuthError = err.code && authErrorCodes.includes(err.code);
      if (isAuthError) {
        clearAuthCookies(res);
      }
      next(err);
    }
  }

  static async verifyCookies(req: Request, res: Response, next: NextFunction) {
    try {
      const hasAccessToken = !!req.cookies.accessToken;
      const hasRefreshToken = !!req.cookies.refreshToken;

      res.json({
        success: true,
        data: {
          hasAccessToken,
          hasRefreshToken,
          cookiesValid: hasAccessToken && hasRefreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const authReq = req as AuthRequest;
      if (refreshToken && authReq.user) {
        const user = await UserService.findById(authReq.user.id);
        if (user) {
          await AuthService.logout(user, refreshToken);
        }
      }

      clearAuthCookies(res);
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async sendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const user = await UserService.findByEmail(email);
      if (!user) throw new AppError('User not found', 404);
      if (user.isEmailVerified) throw new AppError('Email is already verified', 400);

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      user.verificationToken = verificationToken;
      user.verificationTokenExpires = tokenExpires;
      await user.save();

      await EmailService.sendVerificationEmail(user.email, verificationToken, user.role);

      res.status(200).json({ success: true, message: 'Verification email sent' });
    } catch (err) {
      next(err);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const user = await UserService.findOne({ verificationToken: token });

      if (!user) {
        throw new AppError('Invalid or expired verification token', 400);
      }

      if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
        throw new AppError('Invalid or expired verification token', 400);
      }

      user.isEmailVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();

      // Schedule the first 3-day inactivity reminder!
      await agenda.schedule('in 3 days', 'send-inactivity-reminder', { 
        userId: user._id.toString(), 
        daysInactive: 3 
      });

      res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (err) {
      next(err);
    }
  }
}
