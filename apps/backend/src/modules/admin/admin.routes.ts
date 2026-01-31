import { Router } from 'express';
import {
  moderateRateLimit,
  strictRateLimit,
} from '../../core/middleware/rate-limit.middleware';
import { AdminRole } from '../../shared';
import { authenticate, authorize } from '../auth/auth.middleware';
import { AdminController } from './admin.controller';
import { AdminDashboardController } from './admin-dashboard.controller';
import adminPasswordResetRoutes from './admin-password-reset.routes';
import { AdminVocabularyController } from './admin-vocabulary.controller';

const router = Router();

// Auth Routes
router.post('/login', strictRateLimit, AdminController.login);
router.post('/refresh', moderateRateLimit, AdminController.refresh);
router.get('/me', authenticate, AdminController.me);
router.post('/logout', authenticate, AdminController.logout);

// Password Reset Routes
router.use('/password', adminPasswordResetRoutes);
// Force reload trigger

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
  strictRateLimit,
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminController.changePassword
);

// Dashboard Analytics Routes
router.get(
  '/dashboard-metrics',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminDashboardController.getDashboardMetrics
);

router.get(
  '/problem-words',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminDashboardController.getProblemWords
);

// Vocabulary Analytics Routes
router.get(
  '/vocabulary/overview',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminVocabularyController.getOverview
);

router.get(
  '/vocabulary/top-words',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminVocabularyController.getTopWords
);

router.get(
  '/vocabulary/unused-words',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminVocabularyController.getUnusedWords
);

router.get(
  '/vocabulary/usage-stats',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  AdminVocabularyController.getUsageStats
);

export default router;
