import type { Metadata } from 'next';
import { RegisterContent } from './register-content';

export const metadata: Metadata = {
  title: 'Create Your Free Account',
  description:
    'Start your journey to mastering IELTS vocabulary. Create a free account to track your progress, take adaptive quizzes, and learn 3500+ words.',
  alternates: {
    canonical: '/register',
  },
};

export default function RegisterPage() {
  return <RegisterContent />;
}
