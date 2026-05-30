import type { Metadata } from 'next';
import { PrivacyContent } from '../../../components/privacy/privacy-content';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the Privacy Policy for using IELTS Vocabs. Learn how we collect, protect, and handle your personal data and educational progress analytics.',
  keywords: [
    'IELTS Vocabs Privacy',
    'IELTS Vocabs Privacy Policy',
    'free IELTS prep privacy',
    'spaced repetition IELTS privacy',
    'Abu Bokkor Siddik privacy',
  ],
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
      <PrivacyContent />
    </main>
  );
}
