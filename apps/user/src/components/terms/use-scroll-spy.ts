import { useEffect, useState } from 'react';

/**
 * Custom hook to spy on scrolling sections and return the active section ID.
 * Matches design aesthetics by providing active state for a side navigation.
 * 
 * @param ids Array of section IDs to monitor
 * @param offset Vertical offset to consider a section active (defaults to navbar height + padding)
 */
export function useScrollSpy(ids: readonly string[], offset = 140): string {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      // Check if we are at the very bottom of the page.
      // If so, force the last section to be active since it may be too short to scroll past the top threshold.
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isAtBottom && ids.length > 0) {
        setActiveId(ids[ids.length - 1] || '');
        return;
      }

      // Current scroll position with offset
      const scrollPosition = window.scrollY + offset;

      // Find the active section
      let currentActiveId = ids[0] || '';
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const absoluteTop = top + window.scrollY;
          // If we scrolled past the top of the element, make it active
          if (scrollPosition >= absoluteTop - 10) {
            currentActiveId = id;
          }
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to set initial active section
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ids, offset]);

  return activeId;
}
