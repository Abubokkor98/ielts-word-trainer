import { PageLoadingFallback } from '@ielts/ui';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyEmailChangeContent } from './verify-email-change-content';

export const metadata: Metadata = {
  title: 'Verify Email Change',
  description: 'Confirm and finalize your email address change.',
};

export default function VerifyEmailChangePage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <VerifyEmailChangeContent />
    </Suspense>
  );
}
