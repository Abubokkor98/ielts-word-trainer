import { SpacedRepetitionContent } from 'apps/user/src/components/guides/spaced-repetition/spaced-repetition-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spaced Repetition Guide',
  description:
    'Understand the cognitive science of human memory, Ebbinghaus forgetting curve, spaced practice retrieval, and why spacing outclasses cramming.',
  keywords: [
    'Spaced Repetition Guide',
    'cognitive science retrieval',
    'forgetting curve research',
    'spacing effect vocabulary',
    'long term retention memory',
  ],
  alternates: {
    canonical: '/guides/spaced-repetition',
  },
};

export default function SpacedRepetitionPage() {
  return (
    <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
      <SpacedRepetitionContent />
    </main>
  );
}
