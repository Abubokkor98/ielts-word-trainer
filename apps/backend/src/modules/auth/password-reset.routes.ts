import { Router } from 'express';
import { PasswordResetController } from './password-reset.controller';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { z } from 'zod';

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

const verifyEmailSchema = {
  body: z.object({
    token: z.string(),
  }),
};

router.post(
  '/request-reset',
  validateRequest(requestResetSchema),
  PasswordResetController.requestReset
);
router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  PasswordResetController.resetPassword
);
router.post(
  '/verify-email',
  validateRequest(verifyEmailSchema),
  PasswordResetController.verifyEmail
);
router.post(
  '/resend-verification',
  validateRequest(requestResetSchema),
  PasswordResetController.resendVerification
);

export default router;
