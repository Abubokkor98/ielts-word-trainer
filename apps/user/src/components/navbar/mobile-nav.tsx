'use client';

import type { User as AuthUser } from '@ielts/auth';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BarChart2,
  Book,
  HelpCircle,
  Home,
  LayoutDashboard,
  List,
  LogIn,
  LogOut,
  RotateCcw,
  Settings,
  User,
  UserPlus,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@ielts/ui';
import * as React from 'react';
import { MobileNavLink } from './nav-links';

// ============================================================================
// Types
// ============================================================================

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: AuthUser | null;
  onLogout: () => void;
  dueCount: number;
}

// ============================================================================
// Helpers
// ============================================================================

function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ============================================================================
// Constants & Configuration
// ============================================================================

const PUBLIC_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/vocabulary', label: 'Vocabulary', icon: Book },
  { href: '/quiz', label: 'Quiz', icon: HelpCircle },
];

const AUTH_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my-lists', label: 'My Lists', icon: List },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/review', label: 'Review', icon: RotateCcw, hasBadge: true },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
];

// ============================================================================
// Animation Config — top dropdown
// ============================================================================

const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const DROPDOWN_VARIANTS = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.96 },
};

// ============================================================================
// Component
// ============================================================================

export const MobileNav = ({
  isOpen,
  onClose,
  isAuthenticated,
  user,
  onLogout,
  dueCount,
}: MobileNavProps) => {
  const shouldReduceMotion = useReducedMotion();

  // Prevent background body scrolling when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const transitionConfig = shouldReduceMotion
    ? { duration: 0.05 }
    : { duration: 0.2, ease: [0.16, 1, 0.3, 1] };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — subtle, just dims */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={BACKDROP_VARIANTS}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-[1999] bg-black/40"
            aria-hidden="true"
          />

          {/* Dropdown — positioned below the navbar */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={DROPDOWN_VARIANTS}
            transition={transitionConfig}
            className="fixed left-6 right-6 top-[84px] z-[2001] mx-auto max-w-[1276px] origin-top rounded-[16px] border border-white/[0.04] bg-[#120F17]/45 backdrop-blur-[24px] backdrop-saturate-[1.4] shadow-2xl shadow-black/20 overflow-hidden"
          >
            {/* Navigation links */}
            <nav className="p-1.5" aria-label="Mobile Navigation">
              <div className="flex flex-col gap-0.5">
                {isAuthenticated && user && (
                  <>
                    <div className="flex items-center gap-3 px-3 py-3 mb-1">
                      <Avatar className="h-10 w-10 border border-white/10 shrink-0">
                        <AvatarImage src={user.profilePictureUrl || undefined} alt={user.name} className="object-cover" />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-zinc-200 truncate">{user.name}</span>
                        {user.email && <span className="text-xs text-zinc-400 truncate">{user.email}</span>}
                      </div>
                    </div>
                    <div className="h-px bg-white/[0.06] mx-2 mb-1.5" />
                  </>
                )}

                {PUBLIC_LINKS.map(({ href, label, icon: Icon }) => (
                  <MobileNavLink key={href} href={href} icon={<Icon size={16} />} onClick={onClose}>
                    {label}
                  </MobileNavLink>
                ))}

                {isAuthenticated && (
                  <>
                    <div className="h-px bg-white/[0.06] my-1.5 mx-2" />

                    {AUTH_LINKS.map(({ href, label, icon: Icon, hasBadge }) => (
                      <MobileNavLink
                        key={href}
                        href={href}
                        icon={<Icon size={16} />}
                        onClick={onClose}
                      >
                        {hasBadge && dueCount > 0 ? (
                          <span className="flex items-center justify-between w-full">
                            <span>{label}</span>
                            <span className="text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5 leading-none">
                              {dueCount}
                            </span>
                          </span>
                        ) : (
                          label
                        )}
                      </MobileNavLink>
                    ))}

                    {user?.role === 'admin' && (
                      <MobileNavLink href="/admin" icon={<Settings size={16} />} onClick={onClose}>
                        Admin Panel
                      </MobileNavLink>
                    )}
                  </>
                )}

                {!isAuthenticated && (
                  <>
                    <div className="h-px bg-white/[0.06] my-1.5 mx-2" />

                    <MobileNavLink href="/login" icon={<LogIn size={16} />} onClick={onClose}>
                      Login
                    </MobileNavLink>
                    <MobileNavLink href="/register" icon={<UserPlus size={16} />} onClick={onClose}>
                      Sign Up
                    </MobileNavLink>
                  </>
                )}
              </div>
            </nav>

            {/* Sign out at the bottom */}
            {isAuthenticated && (
              <>
                <div className="h-px bg-white/[0.06] mx-1.5 my-1" />
                <div className="p-1.5 pt-0">
                  <MobileNavLink
                    icon={<LogOut size={16} />}
                    onClick={onLogout}
                    color="text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06]"
                  >
                    Sign Out
                  </MobileNavLink>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
