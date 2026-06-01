import type { Metadata } from 'next';
import { TermsContent } from '../../../components/terms/terms-content';

import { CONTACT_LINKS } from '@ielts/shared';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Read the Terms and Conditions for using IELTS Vocabs, a free educational web application for IELTS Academic and General Training vocabulary preparation.',
  keywords: [
    'IELTS Vocabs Terms',
    'IELTS Vocabs Terms & Conditions',
    'free IELTS prep terms',
    'spaced repetition IELTS terms',
    `${CONTACT_LINKS.creatorName} terms`,
  ],
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
      <TermsContent />
    </main>
  );
}
