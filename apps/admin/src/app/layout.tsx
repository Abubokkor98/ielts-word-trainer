import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import './global.css';
import { ReactQueryProvider, Toaster } from '@ielts/ui';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: {
    default: 'IELTS Admin Panel',
    template: '%s | IELTS Admin',
  },
  description: 'Admin panel for managing IELTS vocabulary platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${inter.className}`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
