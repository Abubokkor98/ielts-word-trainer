import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { AppError } from '../../core/errors/AppError';
import { AuthRequest } from './auth.middleware';

export class AuthController {
  private static setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 3600000, // 7 days
    });
  }

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

      AuthController.setAuthCookies(res, accessToken, refreshToken);

      res.status(201).json({
        success: true,
        accessToken,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
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

      AuthController.setAuthCookies(res, accessToken, refreshToken);

      res.status(200).json({
        success: true,
        accessToken,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
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
        throw new AppError('Refresh token not found', 401);
      }

      // Verify refresh token
      const decoded = await AuthService.verifyToken(refreshToken);
      const user = await UserService.findById(decoded.id);

      if (!user) {
        throw new AppError('User not found', 401);
      }

      if (user.status === 'banned') {
        throw new AppError(
          'Your account has been banned. Please contact support.',
          403
        );
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
        throw new AppError('Invalid refresh token', 401);
      }

      // Token rotation: Generate new tokens and invalidate old refresh token
      const { accessToken, refreshToken: newRefreshToken } =
        await AuthService.generateTokens(user);

      // Remove old refresh token
      await AuthService.logout(user, refreshToken);

      AuthController.setAuthCookies(res, accessToken, refreshToken);

      res.json({
        success: true,
        accessToken,
      });
    } catch (err) {
      // Clear invalid refresh token
      res.clearCookie('refreshToken');
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

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }
}
