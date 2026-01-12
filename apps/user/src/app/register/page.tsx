import type { Metadata } from 'next';
import { RegisterContent } from './register-content';

export const metadata: Metadata = {
  title: 'Create Account - IELTS Vocabs',
  description: 'Start your journey to mastering IELTS vocabulary.',
};

export default function RegisterPage() {
  return <RegisterContent />;
}
