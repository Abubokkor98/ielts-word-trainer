import { Router } from 'express';
import { QuizController } from './quiz.controller';
import { QuizAnalyticsController } from './quiz-analytics.controller';
import { authenticate } from '../auth/auth.middleware';
import { UserRole } from '@ielts/shared';
import { authorize } from '../../core/middleware/authorize.middleware';

const router = Router();

router.post('/generate', authenticate, QuizController.generate);
router.get(
  '/analytics/me',
  authenticate,
  QuizAnalyticsController.getUserAnalytics
);
router.get(
  '/analytics/global',
  authenticate,
  authorize([UserRole.ADMIN]),
  QuizAnalyticsController.getGlobalAnalytics
);

export default router;
