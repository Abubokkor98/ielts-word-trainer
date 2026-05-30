'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  Brain,
  FolderHeart,
  Smartphone,
  Volume2,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface FeatureItem {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly colSpanClass: string;
}

// ============================================================================
// Constants & Configuration
// ============================================================================

const FEATURES: readonly FeatureItem[] = [
  {
    icon: BookOpen,
    title: '3,500+ Curated Words',
    description:
      'A carefully selected vocabulary list covering the most frequently tested words in IELTS Academic and General exams.',
    colSpanClass: 'md:col-span-7',
  },
  {
    icon: Brain,
    title: 'Spaced Repetition Algorithm',
    description:
      'Scientifically proven method that schedules reviews at the optimal time to maximize long-term retention.',
    colSpanClass: 'md:col-span-5',
  },
  {
    icon: Volume2,
    title: 'British Audio Pronunciation',
    description:
      'Authentic British English audio for every single word to master speaking clarity and listening accents.',
    colSpanClass: 'md:col-span-5',
  },
  {
    icon: FolderHeart,
    title: 'Topic-Based Word Lists',
    description:
      'Organized vocabulary by key IELTS themes like Education, Environment, Technology, and Health.',
    colSpanClass: 'md:col-span-7',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking Dashboard',
    description:
      'Visualize your daily reviews, mastery levels, streaks, and exam readiness scores in real time.',
    colSpanClass: 'md:col-span-6',
  },
  {
    icon: Smartphone,
    title: 'Cross-Device Syncing',
    description:
      'Learn seamlessly on your phone, tablet, or laptop. Your learning stats are automatically synchronized.',
    colSpanClass: 'md:col-span-6',
  },
] as const;

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const;

// ============================================================================
// Components
// ============================================================================

export function AboutBentoSection() {
  return (
    <section className="mb-20" aria-labelledby="features-heading">
      <motion.header
        className="mb-12 text-center flex flex-col items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={CARD_VARIANTS}
        transition={{
          duration: 0.6,
          ease: [0.21, 0.47, 0.32, 0.98],
        }}
      >
        <h2
          id="features-heading"
          className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
        >
          What We Offer
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-[48ch]">
          A comprehensive toolset designed to optimize your vocabulary building.
        </p>
      </motion.header>

      {/* Bento Grid layout with 12-column layout */}
      <ul className="grid grid-cols-1 md:grid-cols-12 gap-4 list-none p-0 m-0">
        {FEATURES.map((feature, index) => {
          const IconComponent = feature.icon;

          return (
            <motion.li
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={CARD_VARIANTS}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className={feature.colSpanClass}
            >
              <article className="glass-card rounded-[14px] flex flex-col justify-between p-6 sm:p-7 h-full min-h-[220px] hover:border-[var(--glass-border-hover)] transition-all duration-300 cursor-pointer">
                {/* Icon wrapper matching standard branding */}
                <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary w-fit mb-6">
                  <IconComponent size={24} strokeWidth={1.5} aria-hidden="true" />
                </div>

                {/* Content area */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[15px] font-semibold text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </article>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
