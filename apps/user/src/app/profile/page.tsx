import type { Metadata } from 'next';
import { ProfileContainer } from '../../features/profile';

export const metadata: Metadata = {
  title: 'Profile - IELTS Vocabs',
  description: 'Manage your account settings.',
};

export default function ProfilePage() {
  return <ProfileContainer />;
}
