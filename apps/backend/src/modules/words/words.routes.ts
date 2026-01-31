import { Router } from 'express';
import {
  lightRateLimit,
  moderateRateLimit,
} from '../../core/middleware/rate-limit.middleware';
import { upload } from '../../core/middleware/upload.middleware';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { AdminRole, CreateWordSchema } from '../../shared';
import {
  authenticate,
  authorize,
  requireWriteAccess,
} from '../auth/auth.middleware';
import { WordsController } from './words.controller';

const router = Router();

// Public endpoints with rate limiting
router.get('/', moderateRateLimit, WordsController.getAll); // 30 req/min for searches
router.get('/:id', lightRateLimit, WordsController.getOne); // 100 req/min for single word

// Admin only
router.post(
  '/',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  requireWriteAccess,
  validateRequest({ body: CreateWordSchema }),
  WordsController.create
);

// CSV Upload (Admin only)
router.post(
  '/upload',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  requireWriteAccess,
  upload.single('file'),
  WordsController.uploadCSV
);

// Atomic CSV Upload - All-or-Nothing (Admin only)
router.post(
  '/upload-atomic',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  requireWriteAccess,
  upload.single('file'),
  WordsController.uploadCSVAtomic
);

router.patch(
  '/:id',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  requireWriteAccess,
  WordsController.update
);
router.delete(
  '/:id',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  requireWriteAccess,
  WordsController.delete
);

export default router;
