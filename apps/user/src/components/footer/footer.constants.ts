export interface FooterLink {
  readonly label: string;
  readonly href: string;
}

export const QUICK_LINKS: readonly FooterLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Vocabulary', href: '/vocabulary' },
  { label: 'Quiz', href: '/quiz' },
  { label: 'Dashboard', href: '/dashboard' },
] as const;


export const GET_STARTED_LINKS: readonly FooterLink[] = [
  { label: 'Create Account', href: '/register' },
  { label: 'Sign In', href: '/login' },
] as const;

export const EXTERNAL_LINKS = {
  portfolio: 'https://abubokkor.vercel.app',
  github: 'https://github.com/Abubokkor98/ielts-word-trainer',
} as const;

export const getCurrentYear = () => new Date().getFullYear();

export const CREATOR_NAME = 'Abu Bokkor Siddik';
export const APP_NAME = 'IELTS Vocabs';
export const APP_TAGLINE =
  'Master 3500+ IELTS vocabulary words with spaced repetition and adaptive quizzes. Free forever.';
