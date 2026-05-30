'use client';

import { motion } from 'framer-motion';

// ============================================================================
// Types
// ============================================================================

interface StatItem {
  value: string;
  label: string;
}

// ============================================================================
// Constants & Configuration
// ============================================================================

const STATS: StatItem[] = [
  { value: '3,500+', label: 'IELTS Words' },
  { value: '100+', label: 'Active Learners' },
  { value: '100%', label: 'Free Resources' },
  { value: '4.8 ★', label: 'User Rating' },
];

const STAT_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================================
// Components
// ============================================================================

export function StatsSection() {
  return (
    <section className="w-full bg-[#120f17] relative z-10 py-16 sm:py-24" aria-label="Key Statistics">
      <div className="container max-w-[1324px] px-6 mx-auto">
        <div className="ln-cta-card-wrapper">
          <div className="ln-cta-card-border" />
          <div className="ln-cta-card !py-12 !px-8 sm:!py-14">
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center list-none p-0 m-0 w-full">
              {STATS.map((stat, i) => (
                <motion.li
                  key={stat.label}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={STAT_VARIANTS}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  className="flex flex-col items-center justify-center"
                >
                  {/* Stat Value */}
                  <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </span>

                  {/* Stat Label */}
                  <span className="mt-2 text-[11px] sm:text-sm font-medium text-zinc-400 font-sans tracking-wide">
                    {stat.label}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
