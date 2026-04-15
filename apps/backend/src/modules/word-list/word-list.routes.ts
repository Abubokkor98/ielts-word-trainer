import { Router } from 'express';
import {
  createRateLimiter,
} from '../../core/middleware/rate-limit.middleware';
import { authenticate } from '../auth/auth.middleware';
import { WordListController } from './word-list.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Read endpoints with user-aware rate limiting (30 reads per min)
const readRateLimit = createRateLimiter(
  60 * 1000,
  30,
  'Too many requests, please try again shortly',
);

router.get('/', readRateLimit, WordListController.getAll);

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
