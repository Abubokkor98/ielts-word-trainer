'use client';

import { motion } from 'framer-motion';

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const;

export function AboutHero() {
  return (
    <motion.header
      className="flex flex-col items-center text-center mb-16 mx-auto"
      initial="hidden"
      animate="visible"
      variants={SECTION_VARIANTS}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
        About{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400">
          IELTS Vocabs
        </span>
      </h1>
      <p className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-[48ch] leading-relaxed font-sans mx-auto">
        A free, open-source vocabulary learning platform built specifically for
        students preparing for the IELTS Academic and General Training exams.
      </p>
      <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[var(--glass-bg)] border border-[var(--rb-border-subtle)] max-w-3xl mx-auto">
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Preparing for IELTS can be financially exhausting, with high exam
          fees and expensive preparation materials. Our mission is to make
          high-quality, research-backed vocabulary tools accessible to everyone,
          regardless of their financial situation.
        </p>
      </div>
    </motion.header>
  );
}
