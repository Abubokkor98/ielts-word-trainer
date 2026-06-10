import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
};

export const sendVerificationSchema = {
  body: z.object({
    email: z.email('Invalid email address'),
  }),
};

export const verifyEmailSchema = {
  body: z.object({
    token: z
      .string()
      .regex(/^[a-f0-9]{64}$/i, 'Invalid verification token format'),
  }),
};

export const changeEmailRequestSchema = {
  body: z.object({
    newEmail: z.email('Invalid email address'),
    currentPassword: z.string().min(1, 'Current password is required'),
  }),
};

export const verifyEmailChangeSchema = {
  body: z.object({
    token: z
      .string()
      .regex(/^[a-f0-9]{64}$/i, 'Invalid verification token format'),
  }),
};
