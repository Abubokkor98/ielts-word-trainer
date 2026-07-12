import { SpeakingCriteriaContent } from 'apps/user/src/components/guides/speaking-criteria/speaking-criteria-content';
import type { Metadata } from 'next';
import { ArticleJsonLd, BreadcrumbJsonLd, GuideLastUpdated } from '../../../../components/seo';

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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Guides', path: '/guides' },
          { name: 'IELTS Speaking Marking Criteria', path: '/guides/speaking-criteria' },
        ]}
      />
      <ArticleJsonLd
        headline="IELTS Speaking Marking Criteria"
        description="Understand the four assessment parameters used by IELTS examiners to grade the Speaking test: Fluency/Coherence, Lexical Resource, Grammatical Range/Accuracy, and Pronunciation."
        path="/guides/speaking-criteria"
        datePublished="2026-01-21"
        dateModified="2026-07-12"
      />
      <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
        <SpeakingCriteriaContent />
        <GuideLastUpdated dateModified="2026-07-12" />
      </main>
    </>
  );
}
