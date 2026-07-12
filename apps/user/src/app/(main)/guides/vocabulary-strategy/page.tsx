import { VocabularyStrategyContent } from 'apps/user/src/components/guides/vocabulary-strategy/vocabulary-strategy-content';
import type { Metadata } from 'next';
import { ArticleJsonLd, BreadcrumbJsonLd, GuideLastUpdated } from '../../../../components/seo';

export const metadata: Metadata = {
  title: 'How to Learn IELTS Vocabulary Strategy',
  description:
    'A strategic, science-backed approach to learning vocabulary effectively for all four sections of the IELTS exam. Master lexical resource using active retrieval, context sentences, and topic organization.',
  keywords: [
    'How to Learn IELTS Vocabulary',
    'IELTS Vocabulary strategy',
    'lexical resource score improvement',
    'active vs passive vocabulary IELTS',
    'context based learning vocabulary',
  ],
  alternates: {
    canonical: '/guides/vocabulary-strategy',
  },
};

export default function VocabularyStrategyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Guides', path: '/guides' },
          { name: 'How to Learn IELTS Vocabulary Strategy', path: '/guides/vocabulary-strategy' },
        ]}
      />
      <ArticleJsonLd
        headline="How to Learn IELTS Vocabulary Strategy"
        description="A strategic, science-backed approach to learning vocabulary effectively for all four sections of the IELTS exam. Master lexical resource using active retrieval, context sentences, and topic organization."
        path="/guides/vocabulary-strategy"
        datePublished="2026-01-21"
        dateModified="2026-07-12"
      />
      <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
        <VocabularyStrategyContent />
        <GuideLastUpdated dateModified="2026-07-12" />
      </main>
    </>
  );
}
