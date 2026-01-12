import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginContent } from './login-content';

export const metadata: Metadata = {
  title: 'Login - IELTS Vocabs',
  description: 'Access your vocabulary learning dashboard.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
