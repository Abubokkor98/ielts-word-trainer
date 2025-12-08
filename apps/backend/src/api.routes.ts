import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import passwordResetRoutes from './modules/auth/password-reset.routes';
import userProfileRoutes from './modules/users/users-profile.routes';
import wordsRoutes from './modules/words/words.routes';
import topicsRoutes from './modules/topics/topics.routes';
import quizRoutes from './modules/quiz/quiz.routes';
import adminRoutes from './modules/admin/admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/password', passwordResetRoutes);
router.use('/users', userProfileRoutes);
router.use('/words', wordsRoutes);
router.use('/topics', topicsRoutes);
router.use('/quiz', quizRoutes);
router.use('/admin', adminRoutes);

export default router;
