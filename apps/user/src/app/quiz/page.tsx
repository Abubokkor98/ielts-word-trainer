import { Metadata } from 'next';
import { QuizContainer } from '../../features/quiz';

export const metadata: Metadata = {
  title: 'Quiz Mode - IELTS Vocabs',
  description: 'Test your knowledge with adaptive quizzes.',
};

export default function QuizPage() {
  return <QuizContainer />;
}
