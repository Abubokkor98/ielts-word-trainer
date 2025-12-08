import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { AppError } from '../../core/errors/AppError';

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

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 3600000,
      });

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

      if (
        !user ||
        !(await AuthService.validatePassword(password, user.passwordHash))
      ) {
        throw new AppError('Invalid email or password', 401);
      }

      const { accessToken, refreshToken } = await AuthService.generateTokens(
        user
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 3600000,
      });

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
      if (!req.user) throw new AppError('Unauthenticated', 401);
      const user = await UserService.findById(req.user.id);
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
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken && req.user) {
        const user = await UserService.findById(req.user.id);
        if (user) {
          await AuthService.logout(user, refreshToken);
        }
      }

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
