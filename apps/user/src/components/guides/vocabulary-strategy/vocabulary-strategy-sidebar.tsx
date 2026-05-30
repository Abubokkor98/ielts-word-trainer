'use client';

import { cn } from '@ielts/ui';
import type { GuideSectionData } from './vocabulary-strategy.constants';

// ============================================================================
// Types
// ============================================================================

interface VocabularyStrategySidebarProps {
  readonly sections: readonly GuideSectionData[];
  readonly activeId: string;
}

// ============================================================================
// Component
// ============================================================================

export function VocabularyStrategySidebar({ sections, activeId }: VocabularyStrategySidebarProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Matches scrollspy offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <aside className="hidden lg:block lg:w-1/4 lg:sticky lg:top-28 h-fit pr-4 self-start">
      <nav aria-label="Vocabulary Strategy Table of Contents" className="space-y-6">
        <h2 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase pb-2 border-b border-[var(--rb-border-subtle)]">
          Table of Contents
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
