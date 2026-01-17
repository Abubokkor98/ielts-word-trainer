import { PageLoadingFallback } from '@ielts/ui';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordContent } from './reset-password-content';

export const metadata: Metadata = {
  title: 'Reset Password - IELTS Vocabs',
  description: 'Set a new password for your account.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
