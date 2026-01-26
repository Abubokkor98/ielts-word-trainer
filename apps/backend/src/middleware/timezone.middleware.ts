import type { NextFunction, Request, Response } from 'express';

// Extract timezone from X-User-Timezone header and attach to request
export function extractTimezone(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers['x-user-timezone'];
  const timezone = Array.isArray(header) ? header[0] : header;

  // Validate timezone to prevent RangeError in toLocaleString
  let safeTimezone = 'UTC';
  if (timezone) {
    try {
      // Test if timezone is valid by attempting to use it
      new Intl.DateTimeFormat('en-US', { timeZone: timezone });
      safeTimezone = timezone;
    } catch {
      // Invalid timezone - keep UTC fallback
    }
  }

  (req as Request & { userTimezone?: string }).userTimezone = safeTimezone;

  next();
}
