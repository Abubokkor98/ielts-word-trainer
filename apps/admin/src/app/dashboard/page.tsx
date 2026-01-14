import type { Metadata } from 'next';
import { DashboardContainer } from '../../features/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard - Admin Panel',
  description: 'Admin dashboard overview with metrics and alerts.',
};

export default function AdminDashboardPage() {
  return <DashboardContainer />;
}
