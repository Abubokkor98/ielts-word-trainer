'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { APP_NAV_LINKS, PUBLIC_NAV_LINKS } from './nav-config';

// ============================================================================
// Types
// ============================================================================

interface DesktopNavProps {
  isAuthenticated: boolean;
  dueCount: number;
}



// ============================================================================
// Constants
// ============================================================================

const HIGHLIGHT_LAYOUT_ID = 'desktop-nav-highlight';

const HIGHLIGHT_STYLE: React.CSSProperties = {
  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.2), inset 0 0.5px 0 rgba(255, 255, 255, 0.06)',
  zIndex: 0,
  background: 'rgba(18, 15, 23, 0.45)',
  backdropFilter: 'blur(24px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
  borderColor: 'rgba(255, 255, 255, 0.08)',
};

export const DesktopNav = ({ isAuthenticated, dueCount }: DesktopNavProps) => {
  // ============================================================================
  // Hooks & State
  // ============================================================================

  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = React.useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // ============================================================================
  // Derived Variables
  // ============================================================================

  const navLinks = React.useMemo(() => {
    if (isAuthenticated) {
      return [...PUBLIC_NAV_LINKS, ...APP_NAV_LINKS];
    }
    return PUBLIC_NAV_LINKS;
  }, [isAuthenticated]);

  // ============================================================================
  // JSX Render
  // ============================================================================

  return (
    <nav
      onMouseLeave={() => setHoveredHref(null)}
      className="hidden lg:flex items-center gap-1.5 relative py-1"
    >
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        const isHovered = hoveredHref === link.href;

        // Show highlight on this link if it's hovered, or if no link is hovered,
        // it defaults to showing on the active route item.
        const showHighlight = isHovered || (hoveredHref === null && isActive);

        return (
          <Link
            key={link.href}
            href={link.href}
            onMouseEnter={() => setHoveredHref(link.href)}
            className={`px-3 py-1.5 text-[13px] uppercase font-mono tracking-wider rounded-xl select-none relative transition-colors duration-200
              ${isActive ? 'text-white font-semibold' : 'text-white font-medium hover:opacity-80'}`}
          >
            {/* Link Text / Label (Positioned on top of the highlight) */}
            <span className="relative z-10 flex items-center gap-1.5">
              {link.label}
              {link.href === '/review' && dueCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold font-mono leading-none text-white bg-red-500 rounded-full z-20">
                  {dueCount}
                </span>
              )}
            </span>

            {/* Framer Motion Sliding Highlight Capsule */}
            {showHighlight && (
              <motion.div
                layoutId={HIGHLIGHT_LAYOUT_ID}
                initial={false}
                className="absolute inset-0 rounded-xl border pointer-events-none"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 380, damping: 32 }
                }
                style={HIGHLIGHT_STYLE}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
