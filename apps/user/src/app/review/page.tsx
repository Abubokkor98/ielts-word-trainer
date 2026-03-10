import type { Metadata } from 'next';
import { ReviewContainer } from '../../features/review';

export const metadata: Metadata = {
  title: 'Review Session - IELTS Vocabs',
  description: 'Practice words using spaced repetition. (Private Page)',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReviewPage() {
  return <ReviewContainer />;
}
