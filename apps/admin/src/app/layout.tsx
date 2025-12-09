import { Inter } from 'next/font/google';
import './global.css';
import { ReactQueryProvider } from './providers';
import { ChakraUIProvider } from '@ielts/ui';
import { AdminSidebar } from '@ielts/ui';

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
            <div className="flex min-h-screen bg-gray-900">
              <AdminSidebar />
              <main className="flex-1 md:ml-64 p-4 md:p-8 transition-all duration-200">
                {children}
              </main>
            </div>
          </ChakraUIProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
