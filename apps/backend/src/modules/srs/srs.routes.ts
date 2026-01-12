import { Router } from 'express';
import { SRSController } from './srs.controller';
import { authenticate } from '../auth/auth.middleware';
import {
  createUserRateLimit,
  moderateRateLimit,
} from '../../core/middleware/rate-limit.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Review endpoint - per-user rate limiting (write operation, 100 reviews per 10 min)
router.post('/review', createUserRateLimit(100, 10), SRSController.review);

// Read endpoints - moderate rate limiting
router.get('/due', moderateRateLimit, SRSController.getDue);
router.get('/stats', moderateRateLimit, SRSController.getStats);
router.get('/word/:wordId', moderateRateLimit, SRSController.getWordStatus);
router.get('/schedule', SRSController.getSchedule); // Query: days (default: 7)

export default router;
