import { WritingCriteriaContent } from 'apps/user/src/components/guides/writing-criteria/writing-criteria-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS Writing Marking Criteria',
  description:
    'Understand the four assessment parameters used by IELTS examiners to grade Writing Task 1 and Task 2: Task Achievement, Coherence/Cohesion, Lexical Resource, and Grammatical Range/Accuracy.',
  keywords: [
    'IELTS Writing Marking Criteria',
    'lexical resource writing',
    'coherence and cohesion writing',
    'grammatical range and accuracy writing',
    'task achievement task response',
  ],
  alternates: {
    canonical: '/guides/writing-criteria',
  },
};

export default function WritingCriteriaPage() {
  return (
    <main className="relative min-h-screen bg-background text-white overflow-x-clip py-8">
      <WritingCriteriaContent />
    </main>
  );
}
