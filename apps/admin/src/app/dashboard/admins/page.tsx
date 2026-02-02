import type { Metadata } from 'next';
import { AdminsContainer } from '../../../features/admins';

export const metadata: Metadata = {
  title: 'Admin Management - Admin Panel',
  description: 'Manage admin accounts and permissions.',
};

export default function AdminManagementPage() {
  return <AdminsContainer />;
}
