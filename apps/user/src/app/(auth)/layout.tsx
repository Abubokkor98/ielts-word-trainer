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
      {/* Subtle premium glows for auth pages */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full flex justify-center items-center">{children}</main>
    </div>
  );
}
