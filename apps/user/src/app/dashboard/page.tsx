import type { Metadata } from 'next';
import { DashboardContainer } from '../../features/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard - IELTS Vocabs',
  description: 'Track your progress and daily goals.',
};

export default function UserDashboardPage() {
  return <DashboardContainer />;
}
