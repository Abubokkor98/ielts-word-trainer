import { Router } from 'express';
import multer from 'multer';
import { AdminController } from './admin.controller';
import { authenticate } from '../auth/auth.middleware';
import { UserRole } from '@ielts/shared';
import { authorize } from '../../core/middleware/authorize.middleware';
import { validateWordInput } from '../words/words.validation';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate, authorize([UserRole.ADMIN]));

router.get('/stats', AdminController.getStats);
router.post(
  '/upload-words',
  upload.single('file'),
  AdminController.uploadWords
);
router.get('/template', AdminController.downloadTemplate);

router.get('/words', AdminController.getWords);
router.post('/words', validateWordInput, AdminController.createWord);
router.delete('/words/:id', AdminController.deleteWord);

router.get('/users/export', AdminController.exportUsers);
router.patch('/users/:id/status', AdminController.updateUserStatus);
router.get('/users', AdminController.getUsers);

export default router;
