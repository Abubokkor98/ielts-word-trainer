import { Inter } from 'next/font/google';
import './global.css';
import { ReactQueryProvider } from './providers';
import { ChakraUIProvider } from '@ielts/ui';
import { Navbar } from '@ielts/ui';

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
          <ChakraUIProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar appType="admin" />
              <main className="flex-1">{children}</main>
            </div>
          </ChakraUIProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
