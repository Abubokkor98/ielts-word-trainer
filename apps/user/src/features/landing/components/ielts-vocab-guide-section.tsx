'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { GraduationCap, Repeat, TrendingUp } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface GuideItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// ============================================================================
// Constants
// ============================================================================

const GUIDE_ITEMS: GuideItemProps[] = [
  {
    icon: TrendingUp,
    title: 'Band 6 vs. Band 8 Vocabulary',
    description:
      'The difference between a Band 6 and a Band 8 lies in lexical resource. While a Band 6 candidate might use common words like "important," a Band 8 candidate uses precise, less common lexical items like "crucial," "paramount," or "indispensable." Precision and collocation accuracy are key.',
  },
  {
    icon: Repeat,
    title: 'The Power of Spaced Repetition',
    description:
      'Spaced Repetition System (SRS) is scientifically proven to combat the forgetting curve. By reviewing words at gradually increasing intervals, you transfer vocabulary from short-term memory to active, long-term memory, ensuring you can recall them instantly during the speaking test.',
  },
  {
    icon: GraduationCap,
    title: 'Academic vs. General Training',
    description:
      'While the speaking and listening sections are identical, the reading and writing sections differ. Academic vocabulary focuses heavily on formal texts, data analysis, and university-level discourse. General Training requires more everyday, workplace-oriented language.',
  },
];

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================================
// Component
// ============================================================================

export function IeltsVocabGuideSection() {
  return (
    <section className="w-full bg-background relative z-10 py-16 sm:py-24" aria-label="IELTS Vocabulary Guide">
      <div className="container max-w-[1000px] px-6 mx-auto">
        <motion.header
          className="text-center mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            The Ultimate Guide to IELTS Vocabulary
          </h2>
          <p className="max-w-[600px] text-zinc-400 text-sm sm:text-base leading-relaxed">
            Mastering lexical resource is 25% of your Speaking and Writing score. Here is what you need to know.
          </p>
        </motion.header>

        {/* Guide Items */}
        <div className="flex flex-col gap-8">
          {GUIDE_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={SECTION_VARIANTS}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
