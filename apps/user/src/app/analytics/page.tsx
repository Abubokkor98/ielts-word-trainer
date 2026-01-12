import { Metadata } from 'next';
import { AnalyticsContainer } from '../../features/analytics';

export const metadata: Metadata = {
  title: 'Analytics - IELTS Vocabs',
  description: 'Detailed breakdown of your learning performance.',
};

export default function AnalyticsPage() {
  return <AnalyticsContainer />;
}
