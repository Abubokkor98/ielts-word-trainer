import { Router } from 'express';
import {
  moderateRateLimit,
  strictRateLimit,
} from '../../core/middleware/rate-limit.middleware';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { extractTimezone } from '../../middleware/timezone.middleware';
import { AuthController } from './auth.controller';
import { authenticate } from './auth.middleware';
import { loginSchema, registerSchema } from './auth.validation';

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

export default router;
