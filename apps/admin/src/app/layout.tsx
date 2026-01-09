import { Inter } from 'next/font/google';
import './global.css';
import { ReactQueryProvider } from '@ielts/ui';
import { ChakraUIProvider } from '@ielts/ui';

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className}`}>
        <ReactQueryProvider>
          <ChakraUIProvider>{children}</ChakraUIProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
