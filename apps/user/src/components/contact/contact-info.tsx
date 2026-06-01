'use client';

import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Clock, Github, Mail } from 'lucide-react';
import { CONTACT_LINKS } from '@ielts/shared';

// ============================================================================
// Types
// ============================================================================

interface InfoItem {
  readonly icon: ComponentType<{ readonly size?: number; readonly className?: string }>;
  readonly label: string;
  readonly value: string;
  readonly isLink?: boolean;
  readonly href?: string;
  readonly note?: string;
}

// ============================================================================
// Constants & Configuration
// ============================================================================

const INFO_ITEMS: readonly InfoItem[] = [
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT_LINKS.supportEmail,
    isLink: true,
    href: `mailto:${CONTACT_LINKS.supportEmail}`,
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 48 hours',
    note: 'We typically respond to inquiries inside 48 hours.',
  },
  {
    icon: Github,
    label: 'GitHub Issues',
    value: 'GitHub Issues Portal',
    isLink: true,
    href: CONTACT_LINKS.githubIssues,
    note: 'Recommended for bug reports and technical issues to get a faster resolution.',
  },
] as const;

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const;

const TRANSITION_CONFIG = {
  duration: 0.6,
  delay: 0.1,
  ease: [0.21, 0.47, 0.32, 0.98],
} as const;

// ============================================================================
// Component
// ============================================================================

export function ContactInfo() {
  return (
    <motion.section
      className="mb-16"
      aria-labelledby="get-in-touch-heading"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={CONTAINER_VARIANTS}
      transition={TRANSITION_CONFIG}
    >
      <article className="glass-card rounded-[30px] p-6 sm:p-10 flex flex-col gap-8 items-stretch text-left w-full overflow-hidden">
        <header className="border-b border-[var(--rb-border-subtle)] pb-6">
          <h2
            id="get-in-touch-heading"
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
          >
            Get in Touch
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Reach out directly through our supported contact channels.
          </p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0">
          {INFO_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <li
                key={item.label}
                className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[var(--glass-border-hover)] hover:bg-[var(--glass-bg-hover)] transition-all duration-300 relative group"
              >
                <div>
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary mb-4 group-hover:scale-105 transition-transform duration-300">
                    <IconComponent size={20} className="text-primary" />
                  </div>
                  <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    {item.label}
                  </h3>
                  <div className="mb-2">
                    {item.isLink && item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="text-base font-semibold text-white hover:text-primary transition-colors underline decoration-primary/40 underline-offset-4"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-base font-semibold text-white">
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
                {item.note && (
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans border-t border-[var(--rb-border-subtle)] pt-3 mt-3">
                    {item.note}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </article>
    </motion.section>
  );
}
