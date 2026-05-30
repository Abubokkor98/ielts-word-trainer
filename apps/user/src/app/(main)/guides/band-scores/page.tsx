import { BandScoresContent } from 'apps/user/src/components/guides/band-scores/band-scores-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS Band Score Guide',
  description:
    'Understand the 9-band IELTS scoring scale, university admission requirements, visa benchmarks, and how overall band scores are calculated.',
  keywords: [
    'IELTS Band Score Guide',
    'IELTS band scores',
    'calculate IELTS band',
    'IELTS university requirements',
    'IELTS for visa and immigration',
  ],
  alternates: {
    canonical: '/guides/band-scores',
  },
};

export default function BandScoresPage() {
  return (
    <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
      <BandScoresContent />
    </main>
  );
}
