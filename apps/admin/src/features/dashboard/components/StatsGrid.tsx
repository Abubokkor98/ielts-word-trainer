'use client';

import { ReactNode } from 'react';

interface StatsGridProps {
  children: ReactNode;
}

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <section
      aria-label="Key Performance Indicators"
      className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 w-full"
    >
      {children}
    </section>
  );
}
