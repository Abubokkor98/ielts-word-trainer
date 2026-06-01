'use client';

import { useAuthStore } from '@ielts/auth';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { sidebarItems } from './sidebar.config';
import { SidebarFooter } from './SidebarFooter';
import { SidebarItem } from './SidebarItem';

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({ isCollapsed = false, onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  // Hide sidebar on login page
  if (pathname === '/login') {
    return null;
  }

  const handleSettingsClick = () => {
    router.push('/dashboard/settings');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full border-r border-border bg-background transition-all duration-300 z-40 flex flex-col justify-between overflow-visible ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Upper Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header with Logo */}
        <header
          className={`h-14 flex items-center shrink-0 transition-all duration-300 ${
            isCollapsed ? 'justify-center px-0' : 'justify-start px-6'
          }`}
        >
          {!isCollapsed ? (
            <Link
              href="/dashboard"
              className="text-lg font-semibold text-foreground tracking-tight focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
            >
              IELTS Admin
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="text-lg font-bold text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm p-1"
            >
              IA
            </Link>
          )}
        </header>

        {/* Navigation Items list */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={isActive}
                  isCollapsed={isCollapsed}
                  showTooltip={isCollapsed}
                />
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer User Info */}
      <SidebarFooter
        user={user}
        isCollapsed={isCollapsed}
        onSettingsClick={handleSettingsClick}
      />

      {/* Toggle collapse action floating button */}
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute -right-3.5 top-6 h-7 w-7 rounded-full border border-border bg-background hover:bg-accent hover:text-foreground text-muted-foreground flex items-center justify-center transition-colors duration-200 z-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      )}
    </aside>
  );
};
