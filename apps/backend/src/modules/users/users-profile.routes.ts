import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { authenticate } from '../auth/auth.middleware';
import { UserProfileController } from './users-profile.controller';

const router = Router();

const updateProfileSchema = {
  body: z.object({
    name: z.string().min(2).optional(),
  }),
};

const changePasswordSchema = {
  body: z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6),
  }),
};

router.get('/profile', authenticate, UserProfileController.getProfile);
router.patch(
  '/profile',
  authenticate,
  validateRequest(updateProfileSchema),
  UserProfileController.updateProfile,
);
router.post(
  '/change-password',
  authenticate,
  validateRequest(changePasswordSchema),
  UserProfileController.changePassword,
);

export default router;
