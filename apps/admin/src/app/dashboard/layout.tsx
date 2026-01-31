'use client';

import { Sidebar } from '@ielts/ui';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-900">
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
        {children}
      </main>
    </div>
  );
}
