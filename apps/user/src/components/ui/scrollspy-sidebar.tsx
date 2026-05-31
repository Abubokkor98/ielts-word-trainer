'use client';

import { cn } from '@ielts/ui';
import type { MouseEvent } from 'react';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface SidebarSection {
  readonly id: string;
  readonly title: string;
  readonly number: string;
}

const DEFAULT_SCROLL_OFFSET = 140;

interface ScrollspySidebarProps {
  readonly sections: readonly SidebarSection[];
  readonly activeId: string;
  readonly ariaLabel?: string;
  readonly title?: string;
  readonly scrollOffset?: number;
}

// ============================================================================
// Component
// ============================================================================

export function ScrollspySidebar({
  sections,
  activeId,
  ariaLabel = 'Table of Contents',
  title = 'Table of Contents',
  scrollOffset = DEFAULT_SCROLL_OFFSET,
}: ScrollspySidebarProps) {
  // Smooth scroll handler to scroll with offset
  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    // Only intercept plain left clicks (no meta/ctrl/shift/alt keys)
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = scrollOffset;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Safely update the URL hash
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState(null, '', `#${id}`);
      }
    }
  };

  return (
    <aside className="hidden lg:block lg:w-1/4 lg:sticky lg:top-28 h-fit pr-4 self-start">
      <nav aria-label={ariaLabel} className="space-y-6">
        <h2 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase pb-2 border-b border-[var(--rb-border-subtle)]">
          {title}
        </h2>
        <ul className="space-y-3 list-none p-0 m-0">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id} className="text-sm">
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className={cn(
                    'block py-1.5 pl-3 border-l-2 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all duration-200 leading-snug',
                    isActive
                      ? 'border-primary text-primary hover:text-primary font-semibold pl-4'
                      : 'border-[var(--rb-border-subtle)]'
                  )}
                >
                  <span className="font-mono text-xs mr-2 opacity-60">
                    {section.number}.
                  </span>
                  {section.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
