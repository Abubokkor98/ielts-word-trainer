import { Inter } from 'next/font/google';
import './global.css';
import { ReactQueryProvider } from '@ielts/ui';
import { ChakraUIProvider } from '@ielts/ui';
import { UserNavbar } from '../components/navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: {
    default: 'IELTS Vocabulary Builder',
    template: '%s | IELTS Vocabulary Builder',
  },
  description:
    'Master IELTS vocabulary with spaced repetition and adaptive quizzes',
  keywords: [
    'IELTS',
    'vocabulary',
    'learning',
    'spaced repetition',
    'quiz',
    'English',
  ],
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
              <UserNavbar />
              <main id="main-content" className="flex-1 flex flex-col">{children}</main>
            </div>
          </ChakraUIProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
