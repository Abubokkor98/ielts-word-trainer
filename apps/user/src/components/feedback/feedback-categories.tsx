'use client';

import { motion } from 'framer-motion';
import { Bug, CheckCircle2, Lightbulb, RefreshCw, ThumbsUp } from 'lucide-react';
import type { ComponentType } from 'react';

// ============================================================================
// Types
// ============================================================================

interface FeedbackCategory {
  readonly icon: ComponentType<{ readonly size?: number; readonly className?: string }>;
  readonly title: string;
  readonly description: string;
  readonly questions: readonly string[];
  readonly colSpan: string;
  readonly gradientClasses: string;
  readonly textColorClass: string;
  readonly borderColorClass: string;
  readonly tip?: string;
}

// ============================================================================
// Constants & Configuration
// ============================================================================

const CATEGORIES: readonly FeedbackCategory[] = [
  {
    icon: ThumbsUp,
    title: "What's Working Well",
    description:
      'What do you love about IELTS Vocabs? Your positive feedback helps us understand what to keep and enhance.',
    questions: [
      'Which features do you use most often?',
      'What has helped you the most in your IELTS preparation?',
      "Is there anything you're particularly impressed with?",
    ],
    colSpan: 'md:col-span-6',
    gradientClasses: 'from-emerald-500/20 to-teal-500/20',
    textColorClass: 'text-emerald-400',
    borderColorClass: 'border-emerald-500/20',
  },
  {
    icon: RefreshCw,
    title: 'What Could Be Improved',
    description:
      "We're always looking for ways to make IELTS Vocabs better. What's frustrating you or feeling incomplete?",
    questions: [
      'Are there features that are hard to find or use?',
      'Is there anything that feels slow or buggy?',
      'What would make your learning experience smoother?',
    ],
    colSpan: 'md:col-span-6',
    gradientClasses: 'from-blue-500/20 to-cyan-500/20',
    textColorClass: 'text-blue-400',
    borderColorClass: 'border-blue-500/20',
  },
  {
    icon: Lightbulb,
    title: 'Feature Suggestions',
    description: "Have an idea for a new feature? We're all ears! Let us know how we can support you.",
    questions: [
      'What feature would make a huge difference in your study routine?',
      'Is there a functionality you wish we had?',
      'How can we better support your IELTS preparation goals?',
    ],
    colSpan: 'md:col-span-6',
    gradientClasses: 'from-purple-500/20 to-pink-500/20',
    textColorClass: 'text-purple-400',
    borderColorClass: 'border-purple-500/20',
  },
  {
    icon: Bug,
    title: 'Bug Reports',
    description: "Spotted something that's not working right? Help us identify and fix it quickly.",
    questions: [
      'What were you doing when the bug occurred?',
      'What happened vs. what did you expect to happen?',
      'Can you reproduce the bug consistently?',
    ],
    colSpan: 'md:col-span-6',
    gradientClasses: 'from-amber-500/20 to-red-500/20',
    textColorClass: 'text-amber-400',
    borderColorClass: 'border-amber-500/20',
    tip: 'Pro tip: For technical bugs, submitting a GitHub Issue is often the fastest way to get it fixed.',
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

export function FeedbackCategories() {
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
          Feedback Guide
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-[50ch]">
          Consider these questions when writing to us to help make your feedback as actionable as possible.
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
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-tr ${category.gradientClasses} border ${category.borderColorClass} ${category.textColorClass}`}
                    >
                      <IconComponent size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {category.title}
                    </h3>
                  </header>

                  <p className="text-sm leading-relaxed text-zinc-300 font-sans mb-4">
                    {category.description}
                  </p>

                  <ul className="space-y-2.5 list-none p-0 m-0 mb-4">
                    {category.questions.map((question) => (
                      <li key={question} className="flex items-start gap-2.5">
                        <CheckCircle2
                          size={16}
                          className={`flex-shrink-0 mt-0.5 ${category.textColorClass}`}
                          aria-hidden="true"
                        />
                        <span className="text-xs sm:text-sm text-zinc-400 leading-normal">
                          {question}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {category.tip && (
                    <p className="text-xs text-zinc-500 font-mono leading-relaxed border-t border-[var(--rb-border-subtle)] pt-3 mt-auto">
                      {category.tip}
                    </p>
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
