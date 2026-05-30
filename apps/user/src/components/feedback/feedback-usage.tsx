'use client';

import { motion } from 'framer-motion';
import { Award, Compass, Heart, ShieldCheck, Sliders } from 'lucide-react';
import type { ComponentType } from 'react';

// ============================================================================
// Types
// ============================================================================

interface UsageItem {
  readonly icon: ComponentType<{ readonly size?: number; readonly className?: string }>;
  readonly title: string;
  readonly description: string;
}

// ============================================================================
// Constants & Configuration
// ============================================================================

const USAGE_ITEMS: readonly UsageItem[] = [
  {
    icon: Compass,
    title: 'Product Roadmap',
    description: 'Your suggestions directly influence what features and tools we design and build next.',
  },
  {
    icon: Sliders,
    title: 'Priority Setting',
    description: 'Aggregated reviews help us align our resources on features that matter most to users.',
  },
  {
    icon: ShieldCheck,
    title: 'Bug Fixes',
    description: 'Detailed bug logs allow our development team to reproduce, track down, and hotfix issues.',
  },
  {
    icon: Award,
    title: 'Feature Design',
    description: 'Your specific use cases and mockups guide the User Experience and interface parameters.',
  },
] as const;

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const;

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
} as const;

// ============================================================================
// Component
// ============================================================================

export function FeedbackUsage() {
  return (
    <motion.section
      className="mb-16 p-8 sm:p-10 rounded-[30px] bg-[var(--rb-bg-body)] border border-[var(--rb-border-subtle)] relative overflow-hidden"
      aria-labelledby="usage-heading"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={CONTAINER_VARIANTS}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {/* Visual Accent Glow */}
      <div className="absolute top-0 right-0 w-[220px] h-[220px] rounded-full bg-primary/5 blur-[80px]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        <header className="lg:col-span-5 flex flex-col items-start text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-[11px] font-mono font-semibold text-primary select-none mb-4">
            Our Process
          </span>
          <h2
            id="usage-heading"
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight"
          >
            How We Use <br />
            Your Feedback
          </h2>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed font-sans max-w-[340px]">
            Your reports and insights aren't sent into a void. Here is exactly how we incorporate your input.
          </p>

          <footer className="mt-8 flex items-center gap-2 text-zinc-300">
            <Heart size={16} className="text-primary animate-pulse" />
            <span className="text-xs font-mono font-semibold tracking-wider uppercase text-zinc-400">
              Thank you for contributing!
            </span>
          </footer>
        </header>

        <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full list-none p-0 m-0">
          {USAGE_ITEMS.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.li
                key={item.title}
                className="flex flex-col items-start gap-2.5"
                variants={ITEM_VARIANTS}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <IconComponent size={16} />
                  </div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pl-10">
                  {item.description}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.section>
  );
}
