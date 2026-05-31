'use client';

import { UserMenu } from '@ielts/ui';
import Link from 'next/link';
import * as React from 'react';
import { DesktopNav } from './desktop-nav';
import { MobileNav } from './mobile-nav';
import { useNavbar } from './use-navbar';

export const UserNavbar = () => {
  const { isOpen, onOpen, onClose, isAuthenticated, user, handleLogout, dueCount, isScrolled } =
    useNavbar();

  const toggleMenu = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const activeScrolled = mounted && isScrolled;

  return (
    <>
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="absolute -top-[9999px] focus:top-0 focus:left-0 focus:p-4 focus:bg-[#1a202c] focus:text-white z-[999] transition-all"
      >
        Skip to main content
      </a>

      {/* Main Navbar Wrapper matching React Bits */}
      <header
        className="fixed top-5 left-0 z-[1500] flex flex-col items-center px-6 font-mono pointer-events-none"
        style={{
          right: 'var(--removed-body-scroll-bar-size, 0px)',
        }}
      >
        <div
          className={`w-full h-14 flex items-center justify-between px-5 border rounded-[16px] transition-all duration-500 pointer-events-auto relative
            ${
              activeScrolled
                ? 'max-w-[1276px] shadow-2xl shadow-black/20'
                : 'max-w-[1680px] bg-transparent border-transparent'
            }`}
          style={
            activeScrolled
              ? {
                  backgroundColor: 'rgba(18, 15, 23, 0.45)',
                  borderColor: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(24px) saturate(1.4)',
                  WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
                }
              : undefined
          }
        >
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-white font-mono font-bold text-sm tracking-wider uppercase hover:opacity-85 transition-opacity"
            >
              IELTS VOCABS
            </Link>

            <span className="text-white/20 font-light text-lg select-none">/</span>

            <DesktopNav isAuthenticated={isAuthenticated} dueCount={dueCount} />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* User Menu - Desktop Only */}
            <div className="hidden lg:flex items-center">
              <UserMenu user={user} onLogout={handleLogout} />
            </div>

            {/* Mobile hamburger — morphs into X when open */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className={`mobile-hamburger${isOpen ? ' open' : ''}`}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isOpen}
        onClose={onClose}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        dueCount={dueCount}
      />
    </>
  );
};
