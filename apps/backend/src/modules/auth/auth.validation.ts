import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
};

export const sendVerificationSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
};

export const verifyEmailSchema = {
  body: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
};
