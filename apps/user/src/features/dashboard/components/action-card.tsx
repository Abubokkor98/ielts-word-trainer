import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ActionCard({ href, title, description, icon: Icon }: ActionCardProps) {
  return (
    <Link href={href} className="no-underline block group" aria-label={`${title}: ${description}`}>
      <div className="relative flex items-center gap-4 p-5 rounded-xl border border-border bg-card/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5 overflow-hidden">
        {/* Subtle gradient accent on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/[0.03] group-hover:to-primary/[0.08] pointer-events-none" />

        <div className="relative shrink-0 flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 border border-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary/15 group-hover:border-primary/25">
          <Icon size={20} strokeWidth={1.5} aria-hidden="true" focusable={false} />
        </div>

        <div className="relative flex flex-col min-w-0">
          <h3 className="text-[15px] font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-snug mt-0.5">
            {description}
          </p>
        </div>

        {/* Arrow indicator */}
        <div className="relative ml-auto shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
