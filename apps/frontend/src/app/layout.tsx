import { Inter } from 'next/font/google';
import './global.css';
import { cn } from '@ielts/ui';
import { ReactQueryProvider } from './providers';
import { ThemeProvider } from '@ielts/ui';

const inter = Inter({ subsets: ['latin'] });

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
        className={cn(
          inter.className,
          'antialiased min-h-screen bg-background'
        )}
      >
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <header className="border-b">
                <div className="container flex items-center justify-between py-4">
                  <h1 className="text-xl font-bold">IELTS Master</h1>
                  <nav className="flex gap-4">
                    <a
                      href="/dashboard"
                      className="text-sm font-medium hover:text-primary"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/vocabulary"
                      className="text-sm font-medium hover:text-primary"
                    >
                      Vocabulary
                    </a>
                    <a
                      href="/quiz"
                      className="text-sm font-medium hover:text-primary"
                    >
                      Quiz
                    </a>
                  </nav>
                </div>
              </header>
              {children}
            </div>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
