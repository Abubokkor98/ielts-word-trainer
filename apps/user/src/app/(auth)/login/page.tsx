import { PageLoadingFallback } from '@ielts/ui';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginContent } from './login-content';

export const metadata: Metadata = {
  title: 'Login to Your Account',
  description:
    'Log in to your IELTS Vocabs account to access your personalized learning dashboard, spaced repetition progress, and saved vocabulary.',
  alternates: {
    canonical: '/login',
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}
