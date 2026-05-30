import { TestFormatContent } from 'apps/user/src/components/guides/test-format/test-format-content';
import type { Metadata } from 'next';

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
    <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
      <TestFormatContent />
    </main>
  );
}
