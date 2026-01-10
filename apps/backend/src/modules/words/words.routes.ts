import { Router } from 'express';
import { WordsController } from './words.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { CreateWordSchema, AdminRole } from '@ielts/shared';
import { upload } from '../../core/middleware/upload.middleware';

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

// CSV Upload (Admin only)
router.post(
  '/upload',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  upload.single('file'),
  WordsController.uploadCSV
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
