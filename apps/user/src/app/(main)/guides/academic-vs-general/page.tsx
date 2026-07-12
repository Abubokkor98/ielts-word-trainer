import { AcademicVsGeneralContent } from 'apps/user/src/components/guides/academic-vs-general/academic-vs-general-content';
import type { Metadata } from 'next';
import { ArticleJsonLd, BreadcrumbJsonLd, GuideLastUpdated } from '../../../../components/seo';

export const metadata: Metadata = {
  title: 'IELTS Academic vs General Training',
  description:
    'Understand the complete differences between the Academic and General Training IELTS modules: target audience, reading and writing section variations, country acceptance, and conversions.',
  keywords: [
    'IELTS Academic vs General Training',
    'academic vs general training',
    'IELTS reading differences',
    'IELTS writing differences',
    'IELTS module comparison',
  ],
  alternates: {
    canonical: '/guides/academic-vs-general',
  },
};

export default function AcademicVsGeneralPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Guides', path: '/guides' },
          { name: 'IELTS Academic vs General Training', path: '/guides/academic-vs-general' },
        ]}
      />
      <ArticleJsonLd
        headline="IELTS Academic vs General Training"
        description="Understand the complete differences between the Academic and General Training IELTS modules: target audience, reading and writing section variations, country acceptance, and conversions."
        path="/guides/academic-vs-general"
        datePublished="2026-01-21"
        dateModified="2026-07-12"
      />
      <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
        <AcademicVsGeneralContent />
        <GuideLastUpdated dateModified="2026-07-12" />
      </main>
    </>
  );
}
