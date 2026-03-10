import type { Metadata } from 'next';
import { DashboardContainer } from '../../features/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Track your progress and daily goals. (Private Page)',
  robots: {
    index: false,
    follow: false,
  },
};

export default function UserDashboardPage() {
  return <DashboardContainer />;
}
