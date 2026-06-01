import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css';
import { ReactQueryProvider, Toaster } from '@ielts/ui';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { siteConfig } from '../lib/site-config';
import { CONTACT_LINKS } from '@ielts/shared';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.displayName}`,
  },

  description: siteConfig.description,

  keywords: [
    'IELTS',
    'vocabulary',
    'learning',
    'spaced repetition',
    'SRS',
    'quiz',
    'English',
    'IELTS preparation',
    'vocabulary builder',
    'free IELTS',
    'IELTS practice',
  ],

  authors: [{ name: CONTACT_LINKS.creatorName }],

  creator: CONTACT_LINKS.creatorName,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description:
      'Master IELTS vocabulary with spaced repetition and adaptive quizzes. 3500+ words, completely free.',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'IELTSVocabs - Free IELTS Vocabulary Learning Platform',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description:
      'Master IELTS vocabulary with spaced repetition and adaptive quizzes. 3500+ words, completely free.',
    images: [siteConfig.ogImage],
    creator: '@abubokkor',
  },

  applicationName: siteConfig.name,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className}`} suppressHydrationWarning>
        <ReactQueryProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ReactQueryProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
