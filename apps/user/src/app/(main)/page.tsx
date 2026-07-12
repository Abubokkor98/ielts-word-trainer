import type { Metadata } from 'next';
import { LandingContainer } from '../../features/landing';
import { siteConfig } from '../../lib/site-config';
import { CONTACT_LINKS } from '@ielts/shared';

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
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT100H', // ISO 8601 duration — estimated ~100 hours to master 3500+ words
    },
  };

  // Organization schema — enables knowledge panels and entity linking
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.displayName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    sameAs: [
      CONTACT_LINKS.companyLinkedin,
      CONTACT_LINKS.githubRepo,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_LINKS.supportEmail,
      contactType: 'customer service',
    },
    founder: {
      '@type': 'Person',
      name: CONTACT_LINKS.creatorName,
      url: CONTACT_LINKS.developer.portfolio,
    },
  };

  // Person schema for the creator — EEAT authority signal for AI systems
  const creatorJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: CONTACT_LINKS.creatorName,
    url: CONTACT_LINKS.developer.portfolio,
    sameAs: [
      CONTACT_LINKS.developer.github,
      CONTACT_LINKS.developer.twitter,
      CONTACT_LINKS.developer.linkedin,
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creatorJsonLd).replace(/</g, '\\u003c') }} />
      <LandingContainer />
    </>
  );
}

