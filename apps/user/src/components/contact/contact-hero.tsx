'use client';

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

export function ContactHero() {
  return (
    <motion.header
      className="flex flex-col items-center text-center mb-12 mx-auto"
      initial="hidden"
      animate="visible"
      variants={SECTION_VARIANTS}
      transition={TRANSITION_CONFIG}
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
        Contact{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400">
          Us
        </span>
      </h1>
      <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-[54ch] leading-relaxed font-sans mx-auto">
        We'd love to hear from you! Whether you have a question, found a bug, or
        want to suggest a new feature, our team is here to help.
      </p>
    </motion.header>
  );
}
