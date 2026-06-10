'use client';

import { cn, TabsList, TabsTrigger } from '@ielts/ui';
import type { SettingsSection } from '../constants/settings-sections';

// ============================================================================
// Types
// ============================================================================

interface SettingsMobileTabsProps {
  readonly sections: readonly SettingsSection[];
}

// ============================================================================
// Component
// ============================================================================

export function SettingsMobileTabs({ sections }: SettingsMobileTabsProps) {
  return (
    <nav className="lg:hidden" aria-label="Settings Navigation">
      <TabsList
        className={cn(
          'flex w-full gap-1 p-1 h-auto rounded-lg',
          'bg-secondary/50 border border-[var(--rb-border-subtle)]'
        )}
      >
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className={cn(
                'flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium flex-1',
                'text-muted-foreground',
                'data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm',
                'data-[state=active]:border data-[state=active]:border-[var(--rb-border-subtle)]'
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">{section.title}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </nav>
  );
}
