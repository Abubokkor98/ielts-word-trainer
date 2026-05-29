'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function CTA() {
  return (
    <section className="ln-cta-section" aria-label="Call to Action">
      <div className="ln-cta-glow" />

      <motion.div
        className="ln-cta-inner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={ANIMATION_VARIANTS}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="ln-cta-card-wrapper">
          <div className="ln-cta-card-border" />
          <div className="ln-cta-card">
            <h2 className="ln-cta-headline">Ready to Boost Your IELTS Score?</h2>

            <p className="ln-cta-sub">
              Join 100+ students already mastering English vocabulary. No credit card required.
            </p>

            <div className="ln-cta-buttons">
              <Link href="/vocabulary" className="ln-cta-btn ln-cta-btn--primary">
                Start Learning — It's Free
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
