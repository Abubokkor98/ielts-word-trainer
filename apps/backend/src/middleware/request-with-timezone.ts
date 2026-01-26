import type { Request } from 'express';

export interface RequestWithTimezone extends Request {
  userTimezone?: string;
}
