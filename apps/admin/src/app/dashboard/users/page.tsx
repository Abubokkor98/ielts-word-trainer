import type { Metadata } from 'next';
import { UsersContainer } from '../../../features/users';

export const metadata: Metadata = {
  title: 'User Management - Admin Panel',
  description: 'Manage platform users and their permissions.',
};

export default function UserManagementPage() {
  return <UsersContainer />;
}
