import { Router } from 'express';
import {
  moderateRateLimit,
  strictRateLimit,
} from '../../core/middleware/rate-limit.middleware';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { validateCsrf } from '../../shared/csrf';
import { AuthController } from './auth.controller';
import { authenticate } from './auth.middleware';
import { loginSchema, registerSchema } from './auth.validation';

const router = Router();

// Note: Login doesn't need CSRF since it creates the session
// CSRF only needed for operations that use existing session
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
router.post(
  '/refresh',
  moderateRateLimit,
  validateCsrf,
  AuthController.refresh
);
router.get('/verify-cookies', AuthController.verifyCookies);
router.get('/me', authenticate, AuthController.me);
router.post('/logout', authenticate, validateCsrf, AuthController.logout);

export default router;
