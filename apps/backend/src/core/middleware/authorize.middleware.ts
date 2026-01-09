import { Request, Response, NextFunction } from 'express';
import { UserRole, AdminRole } from '@ielts/shared';
import { AppError } from '../errors/AppError';
import { AuthRequest } from '../../modules/auth/auth.middleware';

export const authorize = (roles: (UserRole | AdminRole)[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      throw new AppError('Unauthenticated', 401);
    }

    if (!roles.includes(authReq.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
};
