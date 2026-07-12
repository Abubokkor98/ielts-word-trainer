import { MethodologyContent } from 'apps/user/src/components/guides/methodology/methodology-content';
import type { Metadata } from 'next';
import { ArticleJsonLd, BreadcrumbJsonLd, GuideLastUpdated } from '../../../../components/seo';

export const metadata: Metadata = {
  title: 'Our Methodology',
  description:
    'Learn how the IELTS Vocabs scheduling engine applies SM-2 and FSRS-5 spaced repetition algorithms to optimize vocabulary learning with native British audio and context.',
  keywords: [
    'Our Methodology',
    'spaced repetition algorithm',
    'SM-2 flashcard learning',
    'custom IELTS vocabulary prep',
    'FSRS-5 spacing curve',
  ],
  alternates: {
    canonical: '/guides/methodology',
  },
};

export default function MethodologyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Guides', path: '/guides' },
          { name: 'Our Methodology', path: '/guides/methodology' },
        ]}
      />
      <ArticleJsonLd
        headline="Our Methodology"
        description="Learn how the IELTS Vocabs scheduling engine applies SM-2 and FSRS-5 spaced repetition algorithms to optimize vocabulary learning with native British audio and context."
        path="/guides/methodology"
        datePublished="2026-01-21"
        dateModified="2026-07-12"
      />
      <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
        <MethodologyContent />
        <GuideLastUpdated dateModified="2026-07-12" />
      </main>
    </>
  );
}
