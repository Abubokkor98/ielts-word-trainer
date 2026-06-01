import { z } from 'zod';
import { validateRequest } from '../../core/middleware/validate.middleware';

export const createFeedbackSchema = z.object({
  feedbackType: z.enum(['love', 'improve', 'feature', 'bug'], {
    message: 'Feedback category is required',
  }),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  message: z.string().min(3, 'Feedback must be at least 3 characters long').max(2000, 'Feedback cannot exceed 2000 characters'),
  email: z.email({ message: 'Invalid email address' }),
  deviceInfo: z.string().optional(),
});

export const validateFeedbackInput = validateRequest({
  body: createFeedbackSchema,
});
