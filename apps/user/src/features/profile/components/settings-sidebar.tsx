'use client';

import { cn, TabsList, TabsTrigger } from '@ielts/ui';
import type { SettingsSection } from '../constants/settings-sections';

// ============================================================================
// Types
// ============================================================================

interface SettingsSidebarProps {
  readonly sections: readonly SettingsSection[];
}

// ============================================================================
// Component
// ============================================================================

export function SettingsSidebar({ sections }: SettingsSidebarProps) {
  return (
    <aside className="hidden lg:block lg:w-56 lg:sticky lg:top-20 h-fit self-start shrink-0">
      {/* Page Header — inside sticky sidebar so it stays visible */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and preferences
        </p>
      </header>

      <nav aria-label="Settings Navigation" className="flex flex-col gap-1">
        <h2 className="text-xs font-mono font-bold tracking-wider text-muted-foreground uppercase pb-3 mb-1 border-b border-[var(--rb-border-subtle)]">
          Settings
        </h2>
        <TabsList className="flex flex-col h-auto gap-0.5 bg-transparent p-0">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className={cn(
                  'flex items-center justify-start gap-3 px-3 py-2.5 rounded-lg text-sm w-full',
                  'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                  'data-[state=active]:text-primary data-[state=active]:bg-primary/10 data-[state=active]:font-medium data-[state=active]:shadow-none'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {section.title}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </nav>
    </aside>
  );
}
