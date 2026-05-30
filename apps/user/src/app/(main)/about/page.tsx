import type { Metadata } from 'next';
import { AboutContent } from '../../../components/about/about-content';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about IELTS Vocabs, a free open-source vocabulary builder using spaced repetition and native British pronunciation to help you prepare for Academic and General Training.',
  keywords: [
    'About IELTS Vocabs',
    'free IELTS vocabulary',
    'spaced repetition IELTS',
    'open source IELTS prep',
    'Abu Bokkor Siddik',
  ],
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-background text-white overflow-hidden py-8">
      <AboutContent />
    </main>
  );
}
