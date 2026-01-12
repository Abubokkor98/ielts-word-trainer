import { Router } from 'express';
import { z } from 'zod';
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
  validateRequest(requestResetSchema),
  AdminPasswordResetController.requestReset,
);
router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  AdminPasswordResetController.resetPassword,
);

export default router;
