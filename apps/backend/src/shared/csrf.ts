import { randomBytes } from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/errors/AppError';

/**
 * Generate a cryptographically secure CSRF token
 */
export const generateCsrfToken = (): string => {
  return randomBytes(32).toString('hex');
};

/**
 * Set CSRF token as a cookie that frontend can read
 * This cookie is NOT httpOnly so frontend can include it in headers
 */
export const setCsrfCookie = (res: Response, token: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

  res.cookie('csrf-token', token, {
    httpOnly: false, // Frontend needs to read this
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    domain: cookieDomain,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Clear CSRF token cookie
 */
export const clearCsrfCookie = (res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

  res.clearCookie('csrf-token', {
    httpOnly: false,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    domain: cookieDomain,
  });
};

/**
 * Middleware to validate CSRF token on state-changing requests
 * Compares token from header with token from cookie (double-submit pattern)
 */
export const validateCsrf = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const tokenFromHeader = req.headers['x-csrf-token'] as string | undefined;
  const tokenFromCookie = req.cookies['csrf-token'];

  if (!tokenFromHeader || !tokenFromCookie) {
    return next(new AppError('CSRF token missing', 403));
  }

  if (tokenFromHeader !== tokenFromCookie) {
    return next(new AppError('CSRF token mismatch', 403));
  }

  next();
};
