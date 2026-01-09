'use client';

import AuthGuard from '../components/AuthGuard';
import { AdminSidebar } from '@ielts/ui';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-900">
        <AdminSidebar />
        <main
          id="main-content"
          className="flex-1 md:ml-64 p-4 md:p-8 transition-all duration-200"
        >
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
