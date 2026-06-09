'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface MainContentProps {
  readonly children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();

  // The landing/home page handles its own layout/spacing.
  // Other subpages will have a top padding gap to cleanly clear the floating navbar.
  const isHome = pathname === '/';

  return (
    <main
      id="main-content"
      className={`flex-1 flex flex-col transition-[padding] duration-300 ${isHome ? '' : '[--nav-offset:88px] sm:[--nav-offset:96px]'}`}
      style={isHome ? {} : { paddingTop: 'calc(var(--banner-height, 0px) + var(--nav-offset))' }}
    >
      {children}
    </main>
  );
}
