import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@ielts/shared';
import { AppError } from '../errors/AppError';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authorize = (roles: UserRole[]) => {
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
