import type { Metadata } from 'next';
import { ProblemWordsContainer } from '../../../features/problem-words';

export const metadata: Metadata = {
  title: 'Problem Words - Admin Panel',
  description:
    'Detailed analysis of words with low accuracy and high attempts.',
};

export default function ProblemWordsPage() {
  return <ProblemWordsContainer />;
}
