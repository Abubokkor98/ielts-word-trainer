import type { Metadata } from 'next';
import { VocabularyContainer } from '../../../features/vocabulary';

export const metadata: Metadata = {
  title: 'Vocabulary Management - Admin Panel',
  description: 'Manage IELTS vocabulary words for the platform.',
};

export default function VocabularyManagementPage() {
  return <VocabularyContainer />;
}
