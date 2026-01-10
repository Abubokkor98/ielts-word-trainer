import { Router } from 'express';
import { SRSController } from './srs.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/review', SRSController.review); // Body: wordId, quality
router.get('/due', SRSController.getDue);
router.get('/stats', SRSController.getStats);
router.get('/word/:wordId', SRSController.getWordStatus);
router.get('/schedule', SRSController.getSchedule); // Query: days (default: 7)

export default router;
