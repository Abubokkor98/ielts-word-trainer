import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s - IELTS Vocabs',
    default: 'Authentication',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background justify-center items-center py-10 px-4 relative overflow-hidden">
      <main className="relative z-10 w-full flex justify-center items-center">{children}</main>
    </div>
  );
}
