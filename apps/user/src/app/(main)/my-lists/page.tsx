import type { Metadata } from 'next';
import { WordListContainer } from '../../../features/word-list';

export const metadata: Metadata = {
  title: 'My Lists',
  description: 'Manage your personal vocabulary lists. (Private Page)',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyListsPage() {
  return <WordListContainer />;
}
