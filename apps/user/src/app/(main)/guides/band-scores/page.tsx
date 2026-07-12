import { BandScoresContent } from 'apps/user/src/components/guides/band-scores/band-scores-content';
import type { Metadata } from 'next';
import { ArticleJsonLd, BreadcrumbJsonLd, GuideLastUpdated } from '../../../../components/seo';

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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Guides', path: '/guides' },
          { name: 'IELTS Band Score Guide', path: '/guides/band-scores' },
        ]}
      />
      <ArticleJsonLd
        headline="IELTS Band Score Guide"
        description="Understand the 9-band IELTS scoring scale, university admission requirements, visa benchmarks, and how overall band scores are calculated."
        path="/guides/band-scores"
        datePublished="2026-01-21"
        dateModified="2026-07-12"
      />
      <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
        <BandScoresContent />
        <GuideLastUpdated dateModified="2026-07-12" />
      </main>
    </>
  );
}
