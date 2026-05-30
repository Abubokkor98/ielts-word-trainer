'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { BarChart3, BookOpen, UserPlus } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface StepCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// ============================================================================
// Constants & Configuration
// ============================================================================

const STEPS: StepCardProps[] = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up for free to personalize your learning journey, no credit card required.',
  },
  {
    icon: BookOpen,
    title: 'Learn & Practice',
    description: 'Engage with interactive flashcards, quizzes, and context-based exercises.',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'Watch your vocabulary range grow with detailed analytics and streak tracking.',
  },
];

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================================
// Components
// ============================================================================

export function HowItWorksSection() {
  return (
    <section className="w-full bg-background relative z-10 py-16 sm:py-24" aria-label="How It Works">
      <div className="container max-w-[1324px] px-6 mx-auto">
        {/* Section Title & Subtitle */}
        <header className="text-center mb-16 flex flex-col items-center">
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How It Works
          </h2>
          <p className="mt-4 max-w-[600px] text-zinc-400 text-sm sm:text-base leading-relaxed">
            A proven scientific methodology to ensure long-term retention of vocabulary.
          </p>
        </header>

        {/* Steps Grid */}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4 list-none p-0 m-0">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={CARD_VARIANTS}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="h-full"
            >
              <StepCard {...step} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StepCard({ icon: Icon, title, description }: StepCardProps) {
  return (
    <article className="glass-card rounded-2xl flex flex-col items-center text-center p-8 cursor-pointer h-full hover:border-[rgba(255,255,255,0.15)] hover:-translate-y-0.5 transition-all duration-300">
      {/* Centered Icon Container */}
      <div className="inline-flex p-3.5 mb-6 rounded-2xl bg-brand/10 border border-brand/20 text-brand transition-transform duration-300">
        <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
      </div>

      {/* Card Title */}
      <h3 className="font-mono font-bold text-white text-[13px] tracking-wider uppercase mb-3">
        {title}
      </h3>

      {/* Card Description */}
      <p className="text-zinc-400 text-sm leading-relaxed font-sans max-w-[280px]">{description}</p>
    </article>
  );
}
