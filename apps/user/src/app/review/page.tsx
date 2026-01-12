import { Metadata } from 'next';
import { ReviewContainer } from '../../features/review';

export const metadata: Metadata = {
  title: 'Review Session - IELTS Vocabs',
  description: 'Practice words using spaced repetition.',
};

export default function ReviewPage() {
  return <ReviewContainer />;
}
