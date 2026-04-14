import { Router } from 'express';
import {
  createRateLimiter,
  moderateRateLimit,
} from '../../core/middleware/rate-limit.middleware';
import { authenticate } from '../auth/auth.middleware';
import { WordListController } from './word-list.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Read endpoints
router.get('/', moderateRateLimit, WordListController.getAll);

// Write endpoints with rate limiting (60 writes per 10 min)
const writeRateLimit = createRateLimiter(
  10 * 60 * 1000,
  60,
  'Too many list operations',
);

router.post('/', writeRateLimit, WordListController.create);
router.patch('/:listId', writeRateLimit, WordListController.rename);
router.delete('/:listId', writeRateLimit, WordListController.delete);
router.post('/:listId/words', writeRateLimit, WordListController.addWord);
router.delete(
  '/:listId/words/:wordId',
  writeRateLimit,
  WordListController.removeWord,
);

export default router;
