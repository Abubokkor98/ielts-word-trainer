import { Router } from 'express';
import {
  moderateRateLimit,
  strictRateLimit,
} from '../../core/middleware/rate-limit.middleware';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { extractTimezone } from '../../middleware/timezone.middleware';
import { AuthController } from './auth.controller';
import { authenticate } from './auth.middleware';
import {
  loginSchema,
  registerSchema,
  sendVerificationSchema,
  verifyEmailSchema,
  changeEmailRequestSchema,
  verifyEmailChangeSchema,
} from './auth.validation';

const router = Router();

router.post(
  '/register',
  strictRateLimit,
  validateRequest(registerSchema),
  AuthController.register
);
router.post(
  '/login',
  strictRateLimit,
  validateRequest(loginSchema),
  AuthController.login
);
router.post('/refresh', moderateRateLimit, AuthController.refresh);
router.get('/verify-cookies', AuthController.verifyCookies);
//needs timezone for streak checking
router.get('/me', authenticate, extractTimezone, AuthController.me);
router.post('/logout', authenticate, AuthController.logout);

router.post(
  '/send-verification',
  authenticate,
  strictRateLimit,
  validateRequest(sendVerificationSchema),
  AuthController.sendVerification
);

router.post(
  '/verify',
  strictRateLimit,
  validateRequest(verifyEmailSchema),
  AuthController.verifyEmail
);

router.post(
  '/change-email/request',
  authenticate,
  strictRateLimit,
  validateRequest(changeEmailRequestSchema),
  AuthController.requestEmailChange
);

router.post(
  '/change-email/verify',
  strictRateLimit,
  validateRequest(verifyEmailChangeSchema),
  AuthController.verifyEmailChange
);

export default router;
