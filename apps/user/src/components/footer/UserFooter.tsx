'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Heart } from 'lucide-react';
import Link from 'next/link';
import {
  APP_NAME,
  APP_TAGLINE,
  CREATOR_NAME,
  EXAM_GUIDES,
  EXTERNAL_LINKS,
  FREE_RESOURCES,
  getCurrentYear,
  PLATFORM_LINKS,
  STUDY_TIPS,
} from './footer.constants';

const ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function UserFooter() {
  const currentYear = getCurrentYear();

  return (
    <footer className="ln-footer">
      <div className="ln-footer-glow" />

      <div className="ln-footer-separator" />

      <motion.div
        className="ln-footer-inner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={ANIMATION_VARIANTS}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="ln-footer-top">
          <div className="ln-footer-brand">
            <Link href="/" className="ln-footer-logo-text">
              {APP_NAME}
            </Link>
            <p className="ln-footer-tagline">{APP_TAGLINE}</p>
            <a
              href={EXTERNAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="ln-footer-github-link"
              aria-label="GitHub repository"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
          </div>

          <nav className="ln-footer-nav" aria-label="Footer navigation">
            <div className="ln-footer-col">
              <span className="ln-footer-col-title">Platform</span>
              {PLATFORM_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="ln-footer-link">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="ln-footer-col">
              <span className="ln-footer-col-title">Study Tips</span>
              {STUDY_TIPS.map((link) => (
                <Link key={link.href} href={link.href} className="ln-footer-link">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="ln-footer-col">
              <span className="ln-footer-col-title">Guides</span>
              {EXAM_GUIDES.map((link) => (
                <Link key={link.href} href={link.href} className="ln-footer-link">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="ln-footer-col">
              <span className="ln-footer-col-title">Free Resources</span>
              {FREE_RESOURCES.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="ln-footer-link"
                  {...(link.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span>{link.label}</span>
                  {link.isExternal && <ExternalLink size={10} className="ln-footer-link-icon" />}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="ln-footer-divider" />

        <div className="ln-footer-bottom">
          <p className="ln-footer-attribution">
            Created with <Heart size={12} className="ln-footer-heart" fill="currentColor" /> by{' '}
            <a
              href={EXTERNAL_LINKS.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="ln-footer-creator"
            >
              {CREATOR_NAME}
            </a>
          </p>
          <p className="ln-footer-copy">
            © {currentYear} {APP_NAME}
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
