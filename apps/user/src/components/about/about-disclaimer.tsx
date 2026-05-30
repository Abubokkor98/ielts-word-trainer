'use client';

import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const;

export function AboutDisclaimer() {
  return (
    <motion.section
      className="border-t border-[var(--rb-border-subtle)] pt-8 mt-12 flex flex-col sm:flex-row gap-4 items-start select-none"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={FADE_IN_VARIANTS}
      transition={{
        duration: 0.6,
        delay: 0.2,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      aria-labelledby="disclaimer-heading"
    >
      <ShieldAlert
        size={20}
        className="text-zinc-500 flex-shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-2">
        <h2 id="disclaimer-heading" className="text-xs font-mono font-semibold tracking-wider text-zinc-400 uppercase">
          Disclaimer
        </h2>
        <p className="text-[11px] leading-relaxed text-zinc-500 max-w-3xl">
          IELTS Vocabs is an independent study tool and is not affiliated with,
          endorsed by, or connected to IDP Education, British Council, or
          Cambridge Assessment English—the three organizations that jointly own the
          IELTS trademark. IELTS is a registered trademark of the IELTS Partners.
        </p>
      </div>
    </motion.section>
  );
}
