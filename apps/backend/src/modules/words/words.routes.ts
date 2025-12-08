import { Router } from 'express';
import { WordsController } from './words.controller';
import { authenticate, authorize } from '../../core/middleware/auth.middleware';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { CreateWordSchema, UserRole } from '@ielts/shared';

const router = Router();

router.get('/', WordsController.getAll);
router.get('/:id', WordsController.getOne);

// Admin only
router.post(
  '/',
  authenticate,
  authorize([UserRole.ADMIN]),
  validateRequest({ body: CreateWordSchema }),
  WordsController.create
);
router.patch(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN]),
  WordsController.update
);
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.ADMIN]),
  WordsController.delete
);

export default router;
