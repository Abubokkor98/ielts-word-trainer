import { Router } from 'express';
import { strictRateLimit } from '../../core/middleware/rate-limit.middleware';
import { AdminRole } from '../../shared';
import { authenticate, authorize } from '../auth/auth.middleware';
import { QuizController } from './quiz.controller';
import { QuizAnalyticsController } from './quiz-analytics.controller';
import { QuizAttemptController } from './quiz-attempt.controller';

const router = Router();

// Quiz generation - strict rate limiting (expensive operation)
router.get('/generate', authenticate, strictRateLimit, QuizController.generate);

// Quiz attempts
router.post('/attempts', authenticate, QuizAttemptController.create);
router.get('/attempts', authenticate, QuizAttemptController.getUserAttempts);

router.get('/analytics/me', authenticate, QuizAnalyticsController.getUserAnalytics);
router.get(
  '/analytics/global',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  QuizAnalyticsController.getGlobalAnalytics,
);

// Difficulty recommendation
router.get('/recommend-difficulty', authenticate, QuizController.getRecommendedDifficulty);

export default router;
