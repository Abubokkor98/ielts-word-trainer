import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../core/errors/AppError';
import { AdminRole, UserRole } from '../../shared';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole | AdminRole;
  };
}

const VALID_ROLES = new Set<string>([
  ...Object.values(UserRole),
  ...Object.values(AdminRole),
]);

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization?.replace('Bearer ', '');

    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      role: string;
      tokenType?: string;
    };

    if (decoded.tokenType === 'refresh') {
      throw new AppError('Invalid token type', 401);
    }

    if (!VALID_ROLES.has(decoded.role)) {
      throw new AppError('Invalid role in token', 401);
    }

    (req as AuthRequest).user = {
      id: decoded.id,
      role: decoded.role as UserRole | AdminRole,
    };
    next();
  } catch (_error) {
    next(new AppError('Invalid token', 401));
  }
};

export const authorize = (roles: (UserRole | AdminRole)[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return next(new AppError('Unauthenticated', 401));
    }

    if (!roles.includes(authReq.user.role)) {
      return next(new AppError('Forbidden: Insufficient rights', 403));
    }

    next();
  };
};

/**
 * Middleware to block write operations for viewer (demo) accounts
 * Allows read operations (GET) but blocks create/update/delete
 */
export const requireWriteAccess = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    return next(new AppError('Unauthenticated', 401));
  }

  // Block all write operations for viewer role
  if (authReq.user.role === AdminRole.VIEWER) {
    return next(
      new AppError(
        'Demo accounts have read-only access. Write operations are disabled.',
        403
      )
    );
  }

  next();
};
