import type { Metadata } from 'next';
import { AnalyticsContainer } from '../../features/analytics';

export const metadata: Metadata = {
  title: 'Analytics',
  description:
    'Detailed breakdown of your learning performance. (Private Page)',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsPage() {
  return <AnalyticsContainer />;
}
