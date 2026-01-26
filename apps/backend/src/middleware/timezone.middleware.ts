import type { NextFunction, Request, Response } from 'express';

// Extract timezone from X-User-Timezone header and attach to request
export function extractTimezone(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const timezone = req.headers['x-user-timezone'] as string;

  (req as Request & { userTimezone?: string }).userTimezone = timezone || 'UTC';

  next();
}
