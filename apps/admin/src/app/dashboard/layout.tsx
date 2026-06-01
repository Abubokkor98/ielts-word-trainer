'use client';

import { Sidebar } from '@ielts/ui';
import { useIsViewer } from '@ielts/auth';
import { Info } from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isViewer = useIsViewer();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <main
        id="main-content"
        className={`flex-1 p-4 md:p-8 transition-all duration-200 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {isViewer && (
          <section className="mb-6 p-4 rounded-xl border border-primary/30 bg-primary/10 text-primary-foreground flex gap-3 items-start glass-card">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-primary-foreground text-sm">
                Demo Mode (Read-Only Access)
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                You're viewing as a demo user. All create, edit, and delete
                operations are disabled to protect production data.
              </p>
            </div>
          </section>
        )}
        {children}
      </main>
    </div>
  );
}
