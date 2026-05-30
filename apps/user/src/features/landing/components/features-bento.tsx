'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { AudioLines, BarChart3, Monitor, Quote, RefreshCw } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface BentoFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  badges?: string[];
}

// ============================================================================
// Constants & Configuration
// ============================================================================

const ROW_ONE_FEATURES: BentoFeature[] = [
  {
    icon: RefreshCw,
    title: 'Smart Spaced Repetition',
    description:
      "Our algorithm predicts when you're about to forget a word and brings it back for review at the perfect time.",
  },
  {
    icon: AudioLines,
    title: 'Native Audio Pronunciation',
    description:
      'Hear every word spoken by native speakers with a British accent to master the Listening section.',
    badges: ['British Accent'],
  },
];

const ROW_TWO_FEATURES: BentoFeature[] = [
  {
    icon: Quote,
    title: 'Real Context',
    description: 'Learn words through real IELTS-style reading passages and essay examples.',
  },
  {
    icon: BarChart3,
    title: 'Deep Insights',
    description: 'Visual graphs showing your vocabulary growth and exam readiness scores.',
  },
  {
    icon: Monitor,
    title: 'Learn Anywhere',
    description: 'Seamlessly switch between your phone and computer without losing your progress.',
  },
];

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================================
// Components
// ============================================================================

export function FeaturesBentoSection() {
  return (
    <section className="w-full bg-[#0e0b13] relative z-10 py-16 sm:py-24" aria-label="Features">
      <div className="container max-w-[1324px] px-6 mx-auto">
        {/* Section Header */}
        <header className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Everything You Need to Ace IELTS
          </h2>
        </header>

        {/* Bento Grid */}
        <div className="flex flex-col gap-4">
          {/* Row 1: 2 wider cards */}
          <ul className="grid grid-cols-1 md:grid-cols-12 gap-4 list-none p-0 m-0">
            {ROW_ONE_FEATURES.map((feature, i) => (
              <motion.li
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={CARD_VARIANTS}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className={i === 0 ? 'md:col-span-5' : 'md:col-span-7'}
              >
                <BentoCard {...feature} />
              </motion.li>
            ))}
          </ul>

          {/* Row 2: 3 equal cards */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 list-none p-0 m-0">
            {ROW_TWO_FEATURES.map((feature, i) => (
              <motion.li
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={CARD_VARIANTS}
                transition={{
                  duration: 0.5,
                  delay: (i + 2) * 0.08,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
              >
                <BentoCard {...feature} />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function BentoCard({ icon: Icon, title, description, badges }: BentoFeature) {
  return (
    <article className="glass-card rounded-[14px] flex flex-col justify-between p-6 sm:p-7 h-full min-h-[200px] hover:border-[rgba(255,255,255,0.15)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
      {/* Icon */}
      <div className="inline-flex p-3 rounded-xl bg-brand/10 border border-brand/20 text-brand w-fit mb-6">
        <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[15px] font-semibold text-white tracking-tight">{title}</h3>
        <p className="text-[13px] leading-relaxed text-zinc-400">{description}</p>

        {/* Optional Badges */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {badges.map((badge) => (
              <span
                key={badge}
                className="text-[11px] font-medium text-brand bg-brand/10 border border-brand/20 rounded-full px-3 py-1 select-none"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
