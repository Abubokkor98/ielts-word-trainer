import { SpacedRepetitionContent } from 'apps/user/src/components/guides/spaced-repetition/spaced-repetition-content';
import type { Metadata } from 'next';
import { ArticleJsonLd, BreadcrumbJsonLd, GuideLastUpdated } from '../../../../components/seo';

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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Guides', path: '/guides' },
          { name: 'Spaced Repetition Guide', path: '/guides/spaced-repetition' },
        ]}
      />
      <ArticleJsonLd
        headline="Spaced Repetition Guide"
        description="Understand the cognitive science of human memory, Ebbinghaus forgetting curve, spaced practice retrieval, and why spacing outclasses cramming."
        path="/guides/spaced-repetition"
        datePublished="2026-01-21"
        dateModified="2026-07-12"
      />
      <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
        <SpacedRepetitionContent />
        <GuideLastUpdated dateModified="2026-07-12" />
      </main>
    </>
  );
}
