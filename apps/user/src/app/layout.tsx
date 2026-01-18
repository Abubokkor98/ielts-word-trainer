import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './global.css';
import { ChakraUIProvider, ReactQueryProvider } from '@ielts/ui';
import { UserNavbar } from '../components/navbar';
import { RouteGuard } from '../components/route-guard';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: {
    default: 'IELTS Vocabulary Builder',
    template: '%s',
  },
  description: 'Master IELTS vocabulary with spaced repetition and adaptive quizzes',
  keywords: ['IELTS', 'vocabulary', 'learning', 'spaced repetition', 'quiz', 'English'],
  authors: [{ name: 'IELTS Learning Platform' }],
  openGraph: {
    title: 'IELTS Vocabulary Builder',
    description: 'Master IELTS vocabulary with spaced repetition',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IELTS Vocabulary Builder',
    description: 'Master IELTS vocabulary with spaced repetition',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className}`} suppressHydrationWarning>
        <ReactQueryProvider>
          <ChakraUIProvider>
            <RouteGuard>
              <div className="flex flex-col min-h-screen">
                <Suspense fallback={<div className="h-16 bg-[#171923] border-b border-gray-800" />}>
                  <UserNavbar />
                </Suspense>
                <main id="main-content" className="flex-1 flex flex-col">
                  {children}
                </main>
              </div>
            </RouteGuard>
          </ChakraUIProvider>
        </ReactQueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
