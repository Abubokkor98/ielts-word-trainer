import { Router } from 'express';
import { authenticate, authorize, requireWriteAccess } from '../auth/auth.middleware';
import { FeedbackController } from './feedback.controller';
import { validateFeedbackInput } from './feedback.validation';
import { strictRateLimit } from '../../core/middleware/rate-limit.middleware';
import { AdminRole } from '../../shared';

const router = Router();

// Route for submitting feedback: rate limited and authentication required
router.post(
  '/',
  strictRateLimit,
  authenticate,
  validateFeedbackInput,
  FeedbackController.create
);

// Admin-only management endpoints
router.get(
  '/',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  FeedbackController.getAll
);

router.patch(
  '/:id',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  requireWriteAccess,
  FeedbackController.updateStatus
);

router.delete(
  '/:id',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  requireWriteAccess,
  FeedbackController.delete
);

export default router;
