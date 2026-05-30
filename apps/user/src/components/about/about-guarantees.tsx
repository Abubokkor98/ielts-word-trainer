'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const FREE_GUARANTEES = [
  {
    title: 'No Credit Card Required',
    description:
      'Start learning instantly without entering payment information or starting a trial.',
  },
  {
    title: 'No Premium Tiers',
    description:
      'Every feature, word list, and tool is completely unlocked for all users from day one.',
  },
  {
    title: 'No Ads or Data Selling',
    description:
      'We respect your focus and privacy. No tracking networks, no banners, no sponsors.',
  },
  {
    title: '100% Open Source (MIT)',
    description:
      'Our codebase is fully transparent and hosted on GitHub for anyone to audit or contribute.',
  },
] as const;

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const;

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
} as const;

export function AboutGuarantees() {
  return (
    <motion.section
      className="mb-20 p-8 sm:p-10 rounded-3xl bg-[var(--rb-bg-body)] border border-[var(--rb-border-subtle)] relative overflow-hidden"
      aria-labelledby="free-heading"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={SECTION_VARIANTS}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-emerald-500/5 blur-[80px]" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        <header className="lg:col-span-5 flex flex-col items-start text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-mono font-semibold text-emerald-400 select-none mb-4">
            Our Guarantee
          </span>
          <h2
            id="free-heading"
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight"
          >
            100% Free, <br />
            No Strings Attached
          </h2>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed font-sans max-w-[340px]">
            We believe that education is a right, not a luxury. That is why
            IELTS Vocabs is built without monetization features.
          </p>
        </header>

        <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full list-none p-0 m-0">
          {FREE_GUARANTEES.map((item, index) => (
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
                <CheckCircle
                  size={18}
                  className="text-emerald-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed pl-6">
                {item.description}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
