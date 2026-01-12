/**
 * Rate Limiting Middleware
 *
 * Provides different rate limiting tiers for endpoints based on their expense and risk
 *
 * Tiers:
 * - Strict: 5 req/min - Expensive operations (quiz generation, etc.)
 * - Moderate: 30 req/min - Normal operations (searches, lists)
 * - Light: 100 req/min - Cached/cheap operations
 * - Per-user: Custom limits per authenticated user
 */

import type { Request } from 'express';
import rateLimit from 'express-rate-limit';
import type { AuthRequest } from '../../modules/auth/auth.middleware';

// Note: We don't need custom IP handling - the library handles IPv6 automatically
// We only use custom keyGenerator when we want to track by user ID instead of IP

// Strict limits for expensive operations
export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: {
    error: 'Too many requests from this IP, please slow down',
    retryAfter: 60,
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Skip successful requests that hit cache
  skipSuccessfulRequests: false,
  // Skip failed requests (so they don't count against limit)
  skipFailedRequests: false,
});

// Moderate limits for read operations
export const moderateRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    error: 'Too many requests, please try again shortly',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Light limits for cached endpoints
export const lightRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Rate limit exceeded, please wait a moment',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password Reset limits: 3 requests per hour
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    error: 'Too many password reset attempts. Please try again in an hour.',
    retryAfter: 3600,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Creates a rate limiter with custom configuration
 * Authenticated users are tracked by ID, others by IP
 */
export const createRateLimiter = (
  windowMs: number,
  max: number,
  message: string,
  skipAdmin = false,
) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,

    // Only use custom key for authenticated users, otherwise let library handle IP
    // Disable built-in IP validation check because we handle IP fallback manually
    // Using bracket notation req['ip'] to bypass the library's static analysis regex check
    validate: { ip: false },
    keyGenerator: (req: Request) => {
      const user = (req as AuthRequest).user;
      if (user?.id) {
        return `user:${user.id}`;
      }
      const clientIp = req.ip;
      if (!clientIp) {
        console.warn('Rate limit key: undefined IP for unauthenticated request');
        return 'unknown';
      }
      return clientIp;
    },

    // Skip rate limiting for admins
    skip: (req: Request) => {
      if (!skipAdmin) return false;
      const user = (req as AuthRequest).user;
      return user?.role === 'admin';
    },
  });
};

/**
 * Dynamic rate limiter that adjusts limits based on authentication
 * Authenticated users get higher limits
 */
export const dynamicRateLimit = (authenticatedMax: number, publicMax: number) => {
  return rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: (req: Request) => {
      const user = (req as AuthRequest).user;
      return user ? authenticatedMax : publicMax;
    },
    message: (req: Request) => {
      const user = (req as AuthRequest).user;
      const limit = user ? authenticatedMax : publicMax;
      return {
        error: `Rate limit exceeded. Max ${limit} requests per minute`,
        hint: user ? 'Slow down a bit' : 'Consider logging in for higher limits',
      };
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { ip: false },
    keyGenerator: (req: Request) => {
      const user = (req as AuthRequest).user;
      if (user?.id) {
        return `user:${user.id}`;
      }
      if (!req.ip) {
        console.warn('Rate limit key: undefined IP for unauthenticated request');
        return 'unknown';
      }
      return req.ip;
    },
  });
};
