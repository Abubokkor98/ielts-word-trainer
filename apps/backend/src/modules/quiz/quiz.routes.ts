import { Router } from 'express';
import { QuizController } from './quiz.controller';
import { QuizAnalyticsController } from './quiz-analytics.controller';
import { QuizAttemptController } from './quiz-attempt.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { UserRole } from '@ielts/shared';
import { AdminRole } from '@ielts/shared';

const router = Router();

// Public endpoint - no auth required for quiz generation
router.get('/generate', QuizController.generate);

// Quiz attempts
router.post('/attempts', authenticate, QuizAttemptController.create);
router.get('/attempts', authenticate, QuizAttemptController.getUserAttempts);

router.get(
  '/analytics/me',
  authenticate,
  QuizAnalyticsController.getUserAnalytics
);
router.get(
  '/analytics/global',
  authenticate,
  authorize([AdminRole.ADMIN, AdminRole.SUPER_ADMIN]),
  QuizAnalyticsController.getGlobalAnalytics
);

// Difficulty recommendation
router.get(
  '/recommend-difficulty',
  authenticate,
  QuizController.getRecommendedDifficulty
);

export default router;
