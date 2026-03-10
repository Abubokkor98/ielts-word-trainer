import type { Metadata } from 'next';
import { QuizContainer } from '../../features/quiz';

export const metadata: Metadata = {
  title: 'IELTS Vocabulary Quiz - Practice & Spaced Repetition',
  description:
    'Test your IELTS word knowledge with our adaptive quizzes. Use spaced repetition (SRS) to memorize words faster and retain them until your exam.',
  keywords: [
    'IELTS vocabulary quiz',
    'English word test',
    'spaced repetition learning',
    'IELTS practice online',
  ],
  alternates: {
    canonical: '/quiz',
  },
};

export default function QuizPage() {
  return <QuizContainer />;
}
