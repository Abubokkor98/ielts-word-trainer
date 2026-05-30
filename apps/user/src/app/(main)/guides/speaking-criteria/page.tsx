import { SpeakingCriteriaContent } from 'apps/user/src/components/guides/speaking-criteria/speaking-criteria-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS Speaking Marking Criteria',
  description:
    'Understand the four assessment parameters used by IELTS examiners to grade the Speaking test: Fluency/Coherence, Lexical Resource, Grammatical Range/Accuracy, and Pronunciation.',
  keywords: [
    'IELTS Speaking Marking Criteria',
    'fluency and coherence speaking',
    'lexical resource speaking',
    'pronunciation scoring ielts',
    'speaking band descriptors',
  ],
  alternates: {
    canonical: '/guides/speaking-criteria',
  },
};

export default function SpeakingCriteriaPage() {
  return (
    <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
      <SpeakingCriteriaContent />
    </main>
  );
}
