import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { AdminRole } from '@ielts/shared';
import adminPasswordResetRoutes from './admin-password-reset.routes';

const router = Router();

// Auth Routes
router.post('/login', AdminController.login);
router.post('/refresh', AdminController.refresh);
router.get('/me', authenticate, AdminController.me);

// Password Reset Routes
router.use('/password', adminPasswordResetRoutes);

// Management Routes
router.get(
  '/stats',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminController.getStats
);

router.get(
  '/users',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminController.getUsers
);

router.patch(
  '/users/:id/status',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminController.updateUserStatus
);

router.get(
  '/users/export',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminController.exportUsers
);

router.get(
  '/admins',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminController.getAll
);
router.post(
  '/admins',
  authenticate,
  authorize([AdminRole.SUPER_ADMIN]),
  AdminController.create
);
router.put(
  '/admins/:id',
  authenticate,
  authorize([AdminRole.SUPER_ADMIN]),
  AdminController.update
);
router.delete(
  '/admins/:id',
  authenticate,
  authorize([AdminRole.SUPER_ADMIN]),
  AdminController.delete
);

// Profile Routes
router.patch(
  '/profile',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminController.updateProfile
);

router.post(
  '/change-password',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminController.changePassword
);

// Vocabulary Routes
// CRUD handled by /api/v1/words

export default router;
