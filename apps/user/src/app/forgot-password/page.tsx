import type { Metadata } from 'next';
import { ForgotPasswordContent } from './forgot-password-content';

export const metadata: Metadata = {
  title: 'Forgot Password - IELTS Vocabs',
  description: 'Recover access to your account.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
