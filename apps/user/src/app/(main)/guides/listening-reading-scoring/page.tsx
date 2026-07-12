import { ListeningReadingScoringContent } from 'apps/user/src/components/guides/listening-reading-scoring/listening-reading-scoring-content';
import type { Metadata } from 'next';
import { ArticleJsonLd, BreadcrumbJsonLd, GuideLastUpdated } from '../../../../components/seo';

export const metadata: Metadata = {
  title: 'IELTS Listening & Reading Scoring',
  description:
    'Understand how raw scores out of 40 convert to IELTS band scores, compare Academic vs General Reading conversions, and learn score parameters.',
  keywords: [
    'IELTS Listening & Reading Scoring',
    'calculate IELTS score',
    'listening band score conversion',
    'reading band score conversion',
    'raw score out of 40',
  ],
  alternates: {
    canonical: '/guides/listening-reading-scoring',
  },
};

export default function ListeningReadingScoringPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Guides', path: '/guides' },
          { name: 'IELTS Listening & Reading Scoring', path: '/guides/listening-reading-scoring' },
        ]}
      />
      <ArticleJsonLd
        headline="IELTS Listening & Reading Scoring"
        description="Understand how raw scores out of 40 convert to IELTS band scores, compare Academic vs General Reading conversions, and learn score parameters."
        path="/guides/listening-reading-scoring"
        datePublished="2026-01-21"
        dateModified="2026-07-12"
      />
      <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
        <ListeningReadingScoringContent />
        <GuideLastUpdated dateModified="2026-07-12" />
      </main>
    </>
  );
}
