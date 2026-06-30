import { CONTACT_LINKS } from '@ielts/shared';

export interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly isExternal?: boolean;
}

export const PLATFORM_LINKS: readonly FooterLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
] as const;

export const EXAM_GUIDES: readonly FooterLink[] = [
  { label: 'Band Score Guide', href: '/guides/band-scores' },
  { label: 'IELTS Test Format', href: '/guides/test-format' },
  { label: 'Academic vs General', href: '/guides/academic-vs-general' },
  { label: 'Writing Criteria', href: '/guides/writing-criteria' },
  { label: 'Speaking Criteria', href: '/guides/speaking-criteria' },
  { label: 'Listening & Reading', href: '/guides/listening-reading-scoring' },
] as const;

export const FREE_RESOURCES: readonly FooterLink[] = [
  {
    label: 'IELTS Practice Tests',
    href: 'https://www.ielts.org/for-test-takers/sample-test-questions',
    isExternal: true,
  },
  {
    label: 'British Council Prep',
    href: 'https://learnenglish.britishcouncil.org/free-resources',
    isExternal: true,
  },
  {
    label: 'IDP IELTS Prep',
    href: 'https://ielts.idp.com/prepare',
    isExternal: true,
  },
  {
    label: 'Cambridge IELTS',
    href: 'https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/',
    isExternal: true,
  },
  {
    label: 'Band Score Guide',
    href: 'https://www.ielts.org/for-test-takers/how-ielts-is-scored',
    isExternal: true,
  },
  {
    label: 'British Council Vocab',
    href: 'https://learnenglish.britishcouncil.org/vocabulary',
    isExternal: true,
  },
  {
    label: 'IDP 500+ IELTS Words',
    href: 'https://ielts.idp.com/prepare/vocabulary-words-for-ielts',
    isExternal: true,
  },
] as const;

export const STUDY_TIPS: readonly FooterLink[] = [
  { label: 'Our Methodology', href: '/guides/methodology' },
  { label: 'Spaced Repetition', href: '/guides/spaced-repetition' },
  { label: 'How to Learn Vocab', href: '/guides/vocabulary-strategy' },
  { label: 'Topic-Based Lists', href: '/vocabulary' },
] as const;

export const EXTERNAL_LINKS = {
  portfolio: CONTACT_LINKS.developer.portfolio,
  github: CONTACT_LINKS.githubRepo,
  linkedin: CONTACT_LINKS.companyLinkedin,
} as const;

export const getCurrentYear = () => new Date().getFullYear();

export const CREATOR_NAME = CONTACT_LINKS.creatorName;
export const APP_NAME = 'IELTS Vocabs';
export const APP_TAGLINE =
  'Master 3500+ IELTS vocabulary words with spaced repetition and adaptive quizzes. Free forever.';
