'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ielts/ui';
import { motion } from 'framer-motion';

const FAQS = [
  {
    question: 'What vocabulary do I need for IELTS?',
    answer:
      'You do not need to memorize rare or overly complex words. Examiners look for natural, contextually appropriate, and precise vocabulary. Focus on learning topic-specific vocabulary and common collocations to achieve a Band 7+ score.',
  },
  {
    question: 'How can I improve my IELTS vocabulary?',
    answer:
      'The best way to improve is by learning words in real contexts. Engage in extensive reading, listen to English podcasts, and practice using new words in sentences rather than memorizing isolated word lists. Spaced repetition is also highly effective for long-term retention.',
  },
  {
    question: 'Are idioms and phrasal verbs necessary for IELTS?',
    answer:
      'Yes, especially if you are aiming for a Band 7 or higher. Using phrasal verbs and idiomatic expressions naturally in the Speaking test helps you sound more fluent and like a native speaker. However, accuracy is always more important than complexity.',
  },
  {
    question: 'What are the most common IELTS vocabulary topics?',
    answer:
      'Common themes that frequently appear in both IELTS Academic and General Training include the environment, technology, education, work, health, family, travel, and social trends. Mastering vocabulary in these specific areas is crucial for success.',
  },
  {
    question: 'What common vocabulary mistakes should I avoid in IELTS?',
    answer:
      'Avoid using complex or "fancy" words if you are unsure of their exact meaning or collocation. Additionally, try to paraphrase instead of repeating the exact words from the exam question, and avoid using informal slang in Academic Writing.',
  },
];

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FaqSection() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      className="w-full bg-background relative z-10 py-16 sm:py-24"
      aria-label="Frequently Asked Questions"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
        }}
      />
      <div className="container max-w-[1000px] px-6 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={SECTION_VARIANTS}
        >
          <header className="text-center mb-12 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </header>
          <div className="flex flex-col gap-4">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={faq.question}
                  value={`item-${i}`}
                  className="glass-card px-6 rounded-2xl mb-4 border border-white/10"
                  style={{ boxShadow: 'none' }}
                >
                  <AccordionTrigger className="text-base sm:text-lg text-white font-semibold hover:no-underline text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 text-sm leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
