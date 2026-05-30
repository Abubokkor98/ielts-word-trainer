import type { Metadata } from 'next';
import { FeedbackContent } from '../../../components/feedback/feedback-content';

// ============================================================================
// Metadata
// ============================================================================

export const metadata: Metadata = {
  title: 'Feedback',
  description:
    'Share your experience using IELTS Vocabs. Suggest new features, report bugs, and help make our vocabulary learning platform better for everyone.',
  keywords: [
    'IELTS Vocabs feedback',
    'suggest feature IELTS',
    'improve IELTS Vocabs',
    'report bugs IELTS Vocabs',
    'open source IELTS prep',
  ],
  alternates: {
    canonical: '/feedback',
  },
};

// ============================================================================
// Component Entrypoint
// ============================================================================

export default function FeedbackPage() {
  return (
    <main className="relative min-h-screen bg-background text-white overflow-hidden py-8">
      <FeedbackContent />
    </main>
  );
}
