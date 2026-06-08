import { Suspense } from 'react';
import { UserFooter } from '../../components/footer';
import { MainContent } from '../../components/MainContent';
import { UserNavbar } from '../../components/navbar';
import VerificationBanner from '../../components/VerificationBanner';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <VerificationBanner />
      <Suspense fallback={<div className="h-16 bg-[#120f17] border-b border-[#2f293a]" />}>
        <UserNavbar />
      </Suspense>
      <MainContent>{children}</MainContent>
      <UserFooter />
    </div>
  );
}
