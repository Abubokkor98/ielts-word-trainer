import { AcademicVsGeneralContent } from 'apps/user/src/components/guides/academic-vs-general/academic-vs-general-content';
import type { Metadata } from 'next';

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
    <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
      <AcademicVsGeneralContent />
    </main>
  );
}
