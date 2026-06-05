'use client';

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

// ============================================================================
// Types
// ============================================================================

export interface TopicItem {
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
}

// ============================================================================
// Component
// ============================================================================

export function TopicCard({ topic }: { topic: TopicItem }) {
  const Icon = topic.icon;

  return (
    <Link
      href={`/vocabulary?topic=${encodeURIComponent(topic.slug)}`}
      className="group block h-full"
    >
      <article className="glass-card rounded-[14px] p-4 sm:p-5 h-full flex flex-row sm:flex-col items-center text-left sm:text-center gap-4 sm:gap-3 hover:border-[rgba(255,255,255,0.15)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
        <figure className="inline-flex p-3 rounded-xl bg-brand/10 border border-brand/20 text-brand m-0 shrink-0">
          <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
        </figure>

        <div className="flex flex-col gap-1 sm:gap-2">
          <h3 className="text-[14px] font-semibold text-white tracking-tight">
            {topic.name}
          </h3>

          <p className="text-[12px] leading-relaxed text-zinc-400">
            {topic.description}
          </p>
        </div>
      </article>
    </Link>
  );
}
