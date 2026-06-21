import { Router } from 'express';
import adminRoutes from './modules/admin/admin.routes';
import authRoutes from './modules/auth/auth.routes';
import passwordResetRoutes from './modules/auth/password-reset.routes';
import feedbackRoutes from './modules/feedback/feedback.routes';
import quizRoutes from './modules/quiz/quiz.routes';
import srsRoutes from './modules/srs/srs.routes';
import topicsRoutes from './modules/topics/topics.routes';
import userProfileRoutes from './modules/users/users-profile.routes';
import wordsRoutes from './modules/words/words.routes';
import wordListRoutes from './modules/word-list/word-list.routes';
import cronRoutes from './modules/cron/cron.routes'; // NOTE: VERCEL-ONLY — Remove this import when migrating to VPS/Render

const router = Router();

router.use('/cron', cronRoutes); // NOTE: VERCEL-ONLY — Remove this route when migrating to VPS/Render
router.use('/auth', authRoutes);
router.use('/password', passwordResetRoutes);
router.use('/users', userProfileRoutes);
router.use('/words', wordsRoutes);
router.use('/topics', topicsRoutes);
router.use('/quiz', quizRoutes);
router.use('/admin', adminRoutes);
router.use('/srs', srsRoutes);
router.use('/word-lists', wordListRoutes);
router.use('/feedback', feedbackRoutes);

export default router;
