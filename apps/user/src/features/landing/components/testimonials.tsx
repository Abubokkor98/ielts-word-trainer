'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Star } from 'lucide-react';
import Image from 'next/image';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Testimonial {
  name: string;
  handle: string;
  avatar: string;
  score: string;
  module: 'Academic' | 'General';
  text: string;
}

interface ColumnProps {
  testimonials: Testimonial[];
  direction: 'up' | 'down';
  className?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

// ============================================================================
// Constants & Configuration
// ============================================================================

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    name: 'Priya Sharma',
    handle: '@priya_ielts',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
    score: 'Band 8.5',
    module: 'Academic',
    text: 'The spaced repetition is a lifesaver. I used to forget advanced academic words by the next day, but now they stick. Scoring an 8.5 on Reading felt so achievable!',
  },
  {
    name: 'Li Wei',
    handle: '@liwei_study',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
    score: 'Band 8.0',
    module: 'Academic',
    text: 'Hearing only native British pronunciation was exactly what I needed for the Listening section. Extremely helpful for mastering the accents in Section 3 and 4.',
  },
  {
    name: 'Sara Kowalski',
    handle: '@sara_k_prep',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
    score: 'Band 7.5',
    module: 'General',
    text: 'Learning words through real IELTS passage contexts rather than just dry list definitions completely changed how I write my Writing Task 2 essays.',
  },
  {
    name: 'Ahmed Al-Mansoor',
    handle: '@ahmed_ielts',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
    score: 'Band 8.0',
    module: 'Academic',
    text: 'The progress insights dashboard kept me motivated. Seeing my active vocabulary grow from 200 words to over 1,500 made my preparation feel structured.',
  },
  {
    name: 'Elena Rostova',
    handle: '@elena_r_vocab',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
    score: 'Band 7.5',
    module: 'Academic',
    text: 'Seamless syncing between my phone during my subway commute and my laptop at night meant I never missed a single daily spaced repetition review.',
  },
  {
    name: 'Mateo Lopez',
    handle: '@mateo_l_eng',
    avatar:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&h=100&q=80',
    score: 'Band 8.0',
    module: 'General',
    text: 'Finally, an IELTS app that focuses purely on British English! The audio quality is crystal clear, and the interface is incredibly polished.',
  },
  {
    name: 'Yuki Sato',
    handle: '@yuki_sato_ielts',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80',
    score: 'Band 8.5',
    module: 'Academic',
    text: 'I managed to boost my band score from 6.5 to 7.5 in just four weeks. The daily review cycles are perfect for fast-paced, high-pressure exam prep.',
  },
  {
    name: 'Fatima Al-Sayed',
    handle: '@fatima_a',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80',
    score: 'Band 7.5',
    module: 'Academic',
    text: 'I love how the app categorizes vocabulary by high-yield IELTS topics (Environment, Technology, Education). It makes brainstorming writing ideas much easier!',
  },
  {
    name: 'John Adams',
    handle: '@john_a_ielts',
    avatar:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80',
    score: 'Band 8.0',
    module: 'General',
    text: 'The UI is gorgeous and there are no distracting ads. It feels premium, modern, and is specifically tailored to actual IELTS band descriptors.',
  },
];

const COL_1_DATA: Testimonial[] = [
  TESTIMONIALS_DATA[0],
  TESTIMONIALS_DATA[1],
  TESTIMONIALS_DATA[2],
];
const COL_2_DATA: Testimonial[] = [
  TESTIMONIALS_DATA[3],
  TESTIMONIALS_DATA[4],
  TESTIMONIALS_DATA[5],
];
const COL_3_DATA: Testimonial[] = [
  TESTIMONIALS_DATA[6],
  TESTIMONIALS_DATA[7],
  TESTIMONIALS_DATA[8],
];

const SET_PREFIXES: string[] = ['set-a', 'set-b', 'set-c'];

const HEADER_VARIANTS = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================================
// Sub-components
// ============================================================================

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="ln-test-card">
      <div className="space-y-4">
        <header className="ln-test-card-head">
          <div className="ln-test-card-head-left">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={30}
              height={30}
              className="ln-test-avatar"
            />
            <cite className="ln-test-cite">
              <span className="ln-test-name">{testimonial.name}</span>
              <span className="ln-test-handle">{testimonial.handle}</span>
            </cite>
          </div>
          <span className="ln-test-score-badge">
            <GraduationCap size={11} className="text-brand" />
            <span className="ln-test-score-text">{testimonial.score}</span>
          </span>
        </header>
        <blockquote className="ln-test-text">"{testimonial.text}"</blockquote>
      </div>

      <footer className="ln-test-card-footer">
        <span className="ln-test-module-text">{testimonial.module} Module</span>
        <span className="ln-test-stars">
          <span className="sr-only">5 star rating</span>
          <Star size={11} fill="currentColor" aria-hidden="true" />
          <Star size={11} fill="currentColor" aria-hidden="true" />
          <Star size={11} fill="currentColor" aria-hidden="true" />
          <Star size={11} fill="currentColor" aria-hidden="true" />
          <Star size={11} fill="currentColor" aria-hidden="true" />
        </span>
      </footer>
    </article>
  );
}

function ScrollingColumn({ testimonials, direction, className = '' }: ColumnProps) {
  const scrollClass = direction === 'up' ? 'ln-test-col-scroll--up' : 'ln-test-col-scroll--down';

  return (
    <div className={`ln-test-col ${className}`}>
      <ul className={`ln-test-col-scroll ${scrollClass}`}>
        {SET_PREFIXES.map((prefix, idx) => (
          <li className="ln-test-col-set" key={prefix} aria-hidden={idx > 0 ? 'true' : undefined}>
            {testimonials.map((testimonial) => (
              <TestimonialCard key={`${prefix}-${testimonial.handle}`} testimonial={testimonial} />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function TestimonialsSection() {
  return (
    <section className="ln-test-section">
      <div className="ln-test-inner">
        {/* Section Header */}
        {/* Section Header */}
        <motion.header
          className="flex flex-col items-center text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={HEADER_VARIANTS}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Loved by IELTS Candidates
          </h2>
        </motion.header>

        {/* Testimonials Columns Grid */}
        <div className="ln-test-grid">
          <ScrollingColumn testimonials={COL_1_DATA} direction="up" />
          <ScrollingColumn testimonials={COL_2_DATA} direction="down" className="hidden md:block" />
          <ScrollingColumn
            testimonials={COL_3_DATA}
            direction="up"
            className="hidden sm:block md:block"
          />
        </div>
      </div>
    </section>
  );
}
