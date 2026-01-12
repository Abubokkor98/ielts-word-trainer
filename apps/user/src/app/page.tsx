import type { Metadata } from 'next';
import { LandingContainer } from '../features/landing';

export const metadata: Metadata = {
  title: 'Master IELTS Vocabulary',
  description: 'Learn 3000+ words with adaptive quizzes and spaced repetition.',
};

export default function HomePage() {
  return <LandingContainer />;
}
