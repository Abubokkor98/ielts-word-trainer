import type { Metadata } from 'next';
import { ContactContent } from '../../../components/contact/contact-content';

// ============================================================================
// Metadata
// ============================================================================

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the IELTS Vocabs support team. Ask questions, report bugs, or suggest new features to help improve your IELTS preparation.',
  keywords: [
    'Contact IELTS Vocabs',
    'support IELTS Vocabs',
    'IELTS Vocabs email',
    'report bugs IELTS Vocabs',
    'suggest feature IELTS Vocabs',
  ],
  alternates: {
    canonical: '/contact',
  },
};

// ============================================================================
// Component Entrypoint
// ============================================================================

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-background text-white overflow-hidden py-8">
      <ContactContent />
    </main>
  );
}
