import type { Metadata } from 'next';
import { ProfileContainer } from '../../features/profile';

export const metadata: Metadata = {
  title: 'Profile Settings',
  description: 'Manage your account settings. (Private Page)',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfileContainer />;
}
