'use client';

import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';

// ============================================================================
// Constants & Configuration
// ============================================================================

const TIPS = [
  {
    title: 'Associated Email Address',
    description:
      'Include your registered email address if you are writing to us from a different account.',
  },
  {
    title: 'Device & Browser Information',
    description:
      'Let us know your operating system and web browser details (e.g., "Chrome on Windows 11").',
  },
  {
    title: 'Detailed Description',
    description:
      'Provide a complete summary of your inquiry, including any steps to reproduce a bug.',
  },
  {
    title: 'Visual Screenshots',
    description:
      'Attach screenshots or screen recordings showing the issue if you are reporting a bug.',
  },
] as const;

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const;

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
} as const;

// ============================================================================
// Component
// ============================================================================

export function ContactTips() {
  return (
    <motion.section
      className="mb-16 p-8 sm:p-10 rounded-[30px] bg-[var(--rb-bg-body)] border border-[var(--rb-border-subtle)] relative overflow-hidden"
      aria-labelledby="tips-heading"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={CONTAINER_VARIANTS}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {/* Decorative Blur Background Element */}
      <div className="absolute top-0 right-0 w-[240px] h-[240px] rounded-full bg-primary/5 blur-[90px]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        <header className="lg:col-span-5 flex flex-col items-start text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-[11px] font-mono font-semibold text-primary select-none mb-4">
            Pro Support Tip
          </span>
          <h2
            id="tips-heading"
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight"
          >
            What to Include <br />
            in Your Message
          </h2>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed font-sans max-w-[340px]">
            Providing these details helps our support team diagnose problems and
            deliver accurate answers much faster.
          </p>
        </header>

        <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full list-none p-0 m-0">
          {TIPS.map((tip, index) => (
            <motion.li
              key={tip.title}
              className="flex flex-col items-start gap-2.5"
              variants={ITEM_VARIANTS}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <div className="flex items-center gap-2">
                <CheckSquare
                  size={18}
                  className="text-primary flex-shrink-0"
                  aria-hidden="true"
                />
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  {tip.title}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed pl-6">
                {tip.description}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
