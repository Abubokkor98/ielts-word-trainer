import type { Metadata } from 'next';
import { SettingsContainer } from '../../../features/settings';

export const metadata: Metadata = {
  title: 'Settings - Admin Panel',
  description: 'Manage your account settings and preferences.',
};

export default function SettingsPage() {
  return <SettingsContainer />;
}
