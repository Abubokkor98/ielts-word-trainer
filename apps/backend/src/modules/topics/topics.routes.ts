import { Router } from 'express';
import { TopicsController } from './topics.controller';
import { authenticate, authorize } from '../../core/middleware/auth.middleware';
import { UserRole } from '@ielts/shared';

const router = Router();

router.get('/', TopicsController.getAll);
router.post(
  '/',
  authenticate,
  authorize([UserRole.ADMIN]),
  TopicsController.create
); // Add validation schema if needed
router.patch(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN]),
  TopicsController.update
);
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN]),
  TopicsController.delete
);

export default router;
