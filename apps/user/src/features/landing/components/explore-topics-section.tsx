'use client';

import { Button } from '@ielts/ui';
import { motion } from 'framer-motion';
import {
  Leaf,
  Cpu,
  GraduationCap,
  Heart,
  Briefcase,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { TopicCard } from './topic-card';
import type { TopicItem } from './topic-card';

// ============================================================================
// Constants
// ============================================================================

const TOPICS: TopicItem[] = [
  {
    name: 'Environment',
    slug: 'environment',
    description: 'Climate, ecology, and sustainability vocabulary.',
    icon: Leaf,
  },
  {
    name: 'Technology',
    slug: 'technology',
    description: 'AI, automation, and digital transformation terms.',
    icon: Cpu,
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'Pedagogy, literacy, and academic language.',
    icon: GraduationCap,
  },
  {
    name: 'Health',
    slug: 'health',
    description: 'Healthcare, well-being, and medicine vocabulary.',
    icon: Heart,
  },
  {
    name: 'Work',
    slug: 'work',
    description: 'Career, corporate culture, and labour market terms.',
    icon: Briefcase,
  },
  {
    name: 'Society',
    slug: 'society',
    description: 'Demographics, culture, and social policy language.',
    icon: Users,
  },
];

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

// ============================================================================
// Component
// ============================================================================

export function ExploreTopicsSection() {
  return (
    <section
      className="w-full bg-[#0e0b13] relative z-10 py-16 sm:py-24"
      aria-label="Explore Topics"
    >
      <div className="container max-w-[1324px] px-6 mx-auto">
        <motion.header
          className="text-center mb-12 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Explore by Topic
          </h2>
        </motion.header>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={CONTAINER_VARIANTS}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 list-none p-0 m-0 mb-12"
        >
          {TOPICS.map((topic) => (
            <motion.li key={topic.name} variants={CARD_VARIANTS}>
              <TopicCard topic={topic} />
            </motion.li>
          ))}
        </motion.ul>

        <motion.nav 
          className="text-center" 
          aria-label="View all vocabulary"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={CARD_VARIANTS}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <Button asChild>
            <Link href="/vocabulary">View All 3500+ Words</Link>
          </Button>
        </motion.nav>
      </div>
    </section>
  );
}
