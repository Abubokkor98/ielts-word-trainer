'use client';

import { Badge } from '@ielts/ui';
import { motion } from 'framer-motion';

// ============================================================================
// Constants & Configuration
// ============================================================================

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const;

const TRANSITION_CONFIG = {
  duration: 0.6,
  ease: [0.21, 0.47, 0.32, 0.98],
} as const;

// ============================================================================
// Component
// ============================================================================

export function PrivacyHero() {
  return (
    <motion.header
      className="flex flex-col items-center text-center mb-16 mx-auto"
      initial="hidden"
      animate="visible"
      variants={SECTION_VARIANTS}
      transition={TRANSITION_CONFIG}
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
        Privacy{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400">
          Policy
        </span>
      </h1>
      <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-[58ch] leading-relaxed font-sans mx-auto">
        At IELTS Vocabs, we take your privacy seriously. This Privacy Policy explains what data we collect, how we use it, and your rights regarding your personal information.
      </p>
      <Badge
        variant="secondary"
        className="mt-6 px-4 py-2 text-xs sm:text-sm font-normal text-zinc-400 rounded-full"
      >
        📅 Last Updated: May 30, 2026
      </Badge>
    </motion.header>
  );
}
