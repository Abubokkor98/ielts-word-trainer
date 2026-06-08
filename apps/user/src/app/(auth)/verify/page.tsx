import { PageLoadingFallback } from '@ielts/ui';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyContent } from './verify-content';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email address to access all features.',
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <VerifyContent />
    </Suspense>
  );
}
