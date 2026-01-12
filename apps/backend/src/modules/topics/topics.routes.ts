import { AdminRole, UserRole } from '@ielts/shared';
import { Router } from 'express';
import { authenticate, authorize } from '../auth/auth.middleware';
import { TopicsController } from './topics.controller';

const router = Router();

router.get('/', TopicsController.getAll);
router.post(
  '/',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  TopicsController.create,
); // Add validation schema if needed
router.patch(
  '/:id',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  TopicsController.update,
);
router.delete(
  '/:id',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  TopicsController.delete,
);

export default router;
