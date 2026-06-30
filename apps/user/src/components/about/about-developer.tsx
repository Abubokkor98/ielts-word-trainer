'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@ielts/ui';
import { motion } from 'framer-motion';
import { Github, Globe, Linkedin, Mail } from 'lucide-react';
import { CONTACT_LINKS } from '@ielts/shared';

// ============================================================================
// Types
// ============================================================================

interface SocialItem {
  readonly label: string;
  readonly href: string;
  readonly icon: React.ComponentType<{ readonly size?: number }>;
}

// ============================================================================
// Constants & Icons
// ============================================================================

// Custom SVG icon component for X (formerly Twitter)
const XIcon = ({ size = 16 }: { readonly size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const DEVELOPER_SOCIALS: readonly SocialItem[] = [
  {
    label: 'Email',
    href: `mailto:${CONTACT_LINKS.developer.email}`,
    icon: Mail,
  },
  {
    label: 'X (Twitter)',
    href: CONTACT_LINKS.developer.twitter,
    icon: XIcon,
  },
  {
    label: 'GitHub',
    href: CONTACT_LINKS.developer.github,
    icon: Github,
  },
  {
    label: 'LinkedIn',
    href: CONTACT_LINKS.developer.linkedin,
    icon: Linkedin,
  },
  {
    label: 'Portfolio',
    href: CONTACT_LINKS.developer.portfolio,
    icon: Globe,
  },
] as const;

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const;

// ============================================================================
// Component
// ============================================================================

export function AboutDeveloper() {
  return (
    <motion.section
      className="mb-20"
      aria-labelledby="developer-heading"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={SECTION_VARIANTS}
      transition={{
        duration: 0.6,
        delay: 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      <div className="ln-cta-card-wrapper">
        <div className="ln-cta-card-border" />
        <article className="ln-cta-card !flex !flex-col md:!flex-row gap-8 !items-center md:!items-start !text-center md:!text-left !p-6 sm:!p-8 !w-full !rounded-[30px] overflow-hidden">
          {/* Avatar Area with Glow Rings & Shadcn Avatar */}
          <div className="flex-shrink-0 relative group">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-purple-500 opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-300"
              aria-hidden="true"
            />
            <Avatar className="w-28 h-28 sm:w-32 sm:h-32 p-0.5 bg-gradient-to-tr from-primary/30 to-purple-500/30 border border-[var(--glass-border)] relative z-10 rounded-full flex items-center justify-center overflow-hidden">
              <AvatarImage
                src="/dev.png"
                alt={CONTACT_LINKS.creatorName}
                className="object-cover w-full h-full rounded-full"
              />
              <AvatarFallback className="bg-zinc-900 text-zinc-400 font-bold text-xl uppercase flex items-center justify-center w-full h-full rounded-full">
                ABS
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Details & Socials */}
          <div className="flex flex-col items-center md:items-start flex-1">
            <header className="flex flex-col items-center md:items-start text-center md:text-left mb-4">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block mb-1">
                Founder & Lead Developer
              </span>
              <h2
                id="developer-heading"
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              >
                {CONTACT_LINKS.creatorName}
              </h2>
            </header>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-300 mb-4 font-sans max-w-[65ch]">
              IELTS Vocabs is built and maintained by{' '}
              <span className="font-semibold text-white">{CONTACT_LINKS.creatorName}</span>, a
              full-stack developer passionate about educational technology and helping
              students achieve their IELTS goals.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 mb-6 font-sans max-w-[65ch]">
              The application is hosted on Vercel and built with modern web
              standards to deliver a blazing-fast, secure, and reliable user
              experience.
            </p>

            {/* Social Links matching reference image */}
            <nav className="flex flex-wrap gap-3 items-center justify-center md:justify-start" aria-label="Social links">
              {DEVELOPER_SOCIALS.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-hover)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 shadow-md shadow-black/20"
                    aria-label={social.label}
                  >
                    <SocialIcon size={18} />
                  </a>
                );
              })}
            </nav>
          </div>
        </article>
      </div>
    </motion.section>
  );
}
