import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../core/errors/AppError';
import { UserRole } from '@ielts/shared';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies.refreshToken ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      role: string;
    };
    (req as AuthRequest).user = {
      id: decoded.id,
      role: decoded.role as UserRole,
    };
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};
