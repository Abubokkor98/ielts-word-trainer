import type { Metadata } from 'next';
import { ForgotPasswordContent } from './forgot-password-content';

export const metadata: Metadata = {
  title: 'Forgot Password Recovery - IELTS Vocabs',
  description:
    'Recover access to your IELTS Vocabs account. Enter your email to receive a secure password reset link.',
  alternates: {
    canonical: '/forgot-password',
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
