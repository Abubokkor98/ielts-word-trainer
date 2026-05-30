'use client';

import { motion } from 'framer-motion';
import type { TermsSectionData } from './terms.constants';

// ============================================================================
// Types
// ============================================================================

interface TermsSectionsProps {
  readonly sections: readonly TermsSectionData[];
}

// ============================================================================
// Constants & Configuration
// ============================================================================

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
} as const;

const TRANSITION_CONFIG = {
  duration: 0.5,
  ease: [0.21, 0.47, 0.32, 0.98],
} as const;

// ============================================================================
// Component
// ============================================================================

export function TermsSections({ sections }: TermsSectionsProps) {
  return (
    <div className="w-full lg:w-3/4 flex flex-col gap-12 sm:gap-16">
      {sections.map((section, index) => (
        <motion.section
          key={section.id}
          id={section.id}
          className="scroll-mt-28 sm:scroll-mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={SECTION_VARIANTS}
          transition={{
            ...TRANSITION_CONFIG,
            delay: index === 0 ? 0 : 0.05,
          }}
          aria-labelledby={`heading-${section.id}`}
        >
          <article className="flex flex-col gap-4 text-left">
            <header>
              <h2
                id={`heading-${section.id}`}
                className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-2"
              >
                <span className="text-primary font-mono text-lg sm:text-xl font-bold">
                  {section.number}.
                </span>
                <span>{section.title}</span>
              </h2>
            </header>

            <div className="text-zinc-300 font-sans leading-relaxed text-sm sm:text-base">
              {section.content}
            </div>
          </article>
        </motion.section>
      ))}
    </div>
  );
}
