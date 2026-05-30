'use client';

import { motion } from 'framer-motion';
import { Bug, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import type { ComponentType } from 'react';

// ============================================================================
// Types
// ============================================================================

interface CategoryItem {
  readonly icon: ComponentType<{ readonly size?: number; readonly className?: string }>;
  readonly title: string;
  readonly description: string;
  readonly details?: readonly string[];
  readonly colSpan: string;
  readonly accentColor: string;
}

// ============================================================================
// Constants & Configuration
// ============================================================================

const CATEGORIES: readonly CategoryItem[] = [
  {
    icon: HelpCircle,
    title: 'General Inquiries',
    description:
      "Have a question about how to use IELTS Vocabs, need help with your account, or want to know more about our features? Send us an email and we'll get back to you promptly.",
    colSpan: 'md:col-span-12 lg:col-span-4',
    accentColor: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/20',
  },
  {
    icon: Bug,
    title: 'Bug Reports',
    description:
      "Found a bug or experienced something that isn't working as expected? We appreciate you letting us know! For technical bugs, we highly recommend using GitHub Issues because:",
    details: [
      'Faster response time from our development team',
      'You can track the status of your report',
      'Other users can see if someone else reported the same issue',
      'You can contribute to the fix by providing additional details',
    ],
    colSpan: 'md:col-span-12 lg:col-span-8',
    accentColor: 'from-amber-500/20 to-red-500/20 text-amber-400 border-amber-500/20',
  },
  {
    icon: Sparkles,
    title: 'Feature Requests',
    description:
      "Have an idea for a new feature that would make IELTS Vocabs better? We'd love to hear it! Please include:",
    details: [
      'A clear description of the feature',
      'How it would help your IELTS preparation',
      'Any examples or mockups (optional but helpful)',
    ],
    colSpan: 'md:col-span-12 lg:col-span-12',
    accentColor: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/20',
  },
] as const;

const HEADER_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const;

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const;

// ============================================================================
// Component
// ============================================================================

export function ContactCategories() {
  return (
    <section className="mb-16" aria-labelledby="categories-heading">
      <motion.header
        className="mb-8 text-center flex flex-col items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={HEADER_VARIANTS}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <h2
          id="categories-heading"
          className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
        >
          Inquiry Categories
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-[48ch]">
          Learn more about how to structure your inquiry for faster resolution.
        </p>
      </motion.header>

      <ul className="grid grid-cols-1 md:grid-cols-12 gap-6 list-none p-0 m-0">
        {CATEGORIES.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <motion.li
              key={category.title}
              className={category.colSpan}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={CARD_VARIANTS}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <article className="glass-card rounded-[24px] p-6 sm:p-8 h-full flex flex-col justify-between hover:border-[var(--glass-border-hover)] transition-all duration-300 relative overflow-hidden group">
                <div className="flex flex-col h-full">
                  <header className="flex items-center gap-3 mb-4">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-tr ${category.accentColor} border`}>
                      <IconComponent size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {category.title}
                    </h3>
                  </header>

                  <p className="text-sm leading-relaxed text-zinc-300 font-sans mb-4">
                    {category.description}
                  </p>

                  {category.details && (
                    <ul className="mt-2 space-y-2.5 list-none p-0 m-0">
                      {category.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2.5">
                          <CheckCircle2
                            size={16}
                            className={`flex-shrink-0 mt-0.5 ${category.accentColor.split(' ')[2]}`}
                            aria-hidden="true"
                          />
                          <span className="text-xs sm:text-sm text-zinc-400 leading-normal">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
