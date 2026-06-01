'use client';

import { ReactNode } from 'react';

interface DashboardSectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export function DashboardSection({
  title,
  subtitle,
  children,
}: DashboardSectionProps) {
  return (
    <section className="w-full space-y-4">
      {(title || subtitle) && (
        <div className="mb-2">
          {title && (
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </section>
  );
}
