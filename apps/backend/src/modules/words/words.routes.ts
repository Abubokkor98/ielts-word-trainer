import { Router } from 'express';
import { WordsController } from './words.controller';
import { authenticate, authorize } from '../../core/middleware/auth.middleware';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { CreateWordSchema, AdminRole } from '@ielts/shared';

const router = Router();

router.get('/', WordsController.getAll);
router.get('/:id', WordsController.getOne);

// Admin only
router.post(
  '/',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  validateRequest({ body: CreateWordSchema }),
  WordsController.create
);

router.patch(
  '/:id',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  WordsController.update
);
router.delete(
  '/:id',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  WordsController.delete
);

export default router;
