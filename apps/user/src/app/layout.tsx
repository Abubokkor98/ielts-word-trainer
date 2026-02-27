import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react';
import './global.css';
import { ChakraUIProvider, ReactQueryProvider } from '@ielts/ui';
import { UserNavbar } from '../components/navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteConfig = {
  name: 'IELTSVocabs',
  description:
    'Master 3500+ IELTS vocabulary words with spaced repetition, adaptive quizzes, and personalized learning. Free and comprehensive IELTS preparation platform.',
  url: 'https://ieltsvocabs.vercel.app',
  ogImage: 'https://ieltsvocabs.vercel.app/og-image.png',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
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

  authors: [{ name: 'Abu Bokkor Siddik' }],

  creator: 'Abu Bokkor Siddik',

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

  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${inter.className}`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <ChakraUIProvider>
            <div className="flex flex-col min-h-screen">
              <Suspense
                fallback={
                  <div className="h-16 bg-[#171923] border-b border-gray-800" />
                }
              >
                <UserNavbar />
              </Suspense>
              <main id="main-content" className="flex-1 flex flex-col">
                <NuqsAdapter>{children}</NuqsAdapter>
              </main>
            </div>
          </ChakraUIProvider>
        </ReactQueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
