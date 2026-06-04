import type { Metadata } from 'next';
import { LandingContainer } from '../../features/landing';
import { siteConfig } from '../../lib/site-config';

export const metadata: Metadata = {
  title: { absolute: 'IELTS Vocabs - Master 3500+ IELTS Vocabulary Words for Free' },
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
    name: siteConfig.displayName,
    url: siteConfig.url,
    description:
      'Master IELTS vocabulary with spaced repetition and adaptive quizzes. 3500+ words, completely free.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/vocabulary?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // Google Course rich results structured data
  // Docs: https://developers.google.com/search/docs/appearance/structured-data/course
  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'IELTS Vocabulary Mastery',
    description: 'Master 3500+ essential IELTS words with spaced repetition and adaptive quizzes.',
    provider: {
      '@type': 'Organization',
      name: siteConfig.displayName,
      url: siteConfig.url,
      // Uncomment when project-specific social accounts exist (e.g. facebook.com/ieltsvocabs)
      // sameAs: ['https://x.com/ieltsvocabs', 'https://facebook.com/ieltsvocabs'],
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT100H', // ISO 8601 duration — estimated ~100 hours to master 3500+ words
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd).replace(/</g, '\\u003c') }} />
      <LandingContainer />
    </>
  );
}
