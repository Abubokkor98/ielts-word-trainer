import { Router } from 'express';
import { z } from 'zod';
import {
  passwordResetRateLimit,
  strictRateLimit,
} from '../../core/middleware/rate-limit.middleware';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { AdminPasswordResetController } from './admin-password-reset.controller';

const router = Router();

const requestResetSchema = {
  body: z.object({
    email: z.string().email(),
  }),
};

const resetPasswordSchema = {
  body: z.object({
    token: z.string(),
    password: z.string().min(6),
  }),
};

router.post(
  '/request-reset',
  passwordResetRateLimit,
  validateRequest(requestResetSchema),
  AdminPasswordResetController.requestReset,
);
router.post(
  '/reset-password',
  strictRateLimit,
  validateRequest(resetPasswordSchema),
  AdminPasswordResetController.resetPassword,
);

export default router;
