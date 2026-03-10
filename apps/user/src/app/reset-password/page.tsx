import { PageLoadingFallback } from '@ielts/ui';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordContent } from './reset-password-content';

export const metadata: Metadata = {
  title: 'Set New Password - IELTS Vocabs',
  description: 'Set a new secure password for your IELTS Vocabs account.',
  alternates: {
    canonical: '/reset-password',
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
