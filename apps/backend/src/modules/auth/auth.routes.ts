import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { registerSchema, loginSchema } from './auth.validation';
import { authenticate } from './auth.middleware';

const router = Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  AuthController.register
);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.get('/me', authenticate, AuthController.me);
router.post('/logout', authenticate, AuthController.logout);

export default router;
