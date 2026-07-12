import { TestFormatContent } from 'apps/user/src/components/guides/test-format/test-format-content';
import type { Metadata } from 'next';
import { ArticleJsonLd, BreadcrumbJsonLd, GuideLastUpdated } from '../../../../components/seo';

export const metadata: Metadata = {
  title: 'IELTS Test Format Overview',
  description:
    'Understand the complete IELTS test structure: sections, timings, question types, and the differences between paper-based and computer-delivered formats.',
  keywords: [
    'IELTS Test Format Overview',
    'IELTS test structure',
    'IELTS exam components',
    'computer delivered IELTS',
    'paper based IELTS',
  ],
  alternates: {
    canonical: '/guides/test-format',
  },
};

export default function TestFormatPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Guides', path: '/guides' },
          { name: 'IELTS Test Format Overview', path: '/guides/test-format' },
        ]}
      />
      <ArticleJsonLd
        headline="IELTS Test Format Overview"
        description="Understand the complete IELTS test structure: sections, timings, question types, and the differences between paper-based and computer-delivered formats."
        path="/guides/test-format"
        datePublished="2026-01-21"
        dateModified="2026-07-12"
      />
      <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
        <TestFormatContent />
        <GuideLastUpdated dateModified="2026-07-12" />
      </main>
    </>
  );
}
