import { Router } from 'express';
import { SRSController } from './srs.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/review', SRSController.review); // Body: wordId, quality
router.get('/due', SRSController.getDue);

export default router;
