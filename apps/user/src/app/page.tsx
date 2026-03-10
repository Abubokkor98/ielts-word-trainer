import type { Metadata } from 'next';
import { LandingContainer } from '../features/landing';

export const metadata: Metadata = {
  title: { absolute: 'Master IELTS Vocabulary - Free Learning Platform' },
  description:
    'Learn 3500+ essential IELTS words completely free. Improve your band score with adaptive quizzes, spaced repetition, and personalized vocabulary tracking.',
  keywords: [
    'IELTS vocabulary',
    'free IELTS study',
    'IELTS words',
    'IELTS preparation platform',
    'spaced repetition vocabulary',
  ],
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IELTS Vocabs',
    url: 'https://ieltsvocabs.vercel.app',
    description:
      'Master IELTS vocabulary with spaced repetition and adaptive quizzes. 3500+ words, completely free.',
    potentialAction: {
      '@type': 'SearchAction',
      target:
        'https://ieltsvocabs.vercel.app/vocabulary?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <LandingContainer />
    </>
  );
}
