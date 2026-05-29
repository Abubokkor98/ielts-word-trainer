import { cn } from '@ielts/ui';
import type { QualityRating } from '../types';

interface RatingButtonsProps {
  onRating: (quality: QualityRating) => void;
  isSubmitting: boolean;
}

const RATING_OPTIONS = [
  {
    label: 'Forgot',
    rating: 0 as QualityRating,
    shortcut: '1',
    accentColor: 'text-red-400',
    hoverBorder: 'hover:border-red-400/40',
  },
  {
    label: 'Struggled',
    rating: 3 as QualityRating,
    shortcut: '2',
    accentColor: 'text-amber-400',
    hoverBorder: 'hover:border-amber-400/40',
  },
  {
    label: 'Knew It',
    rating: 4 as QualityRating,
    shortcut: '3',
    accentColor: 'text-emerald-400',
    hoverBorder: 'hover:border-emerald-400/40',
  },
  {
    label: 'Mastered',
    rating: 5 as QualityRating,
    shortcut: '4',
    accentColor: 'text-sky-400',
    hoverBorder: 'hover:border-sky-400/40',
  },
] as const;

export function RatingButtons({ onRating, isSubmitting }: RatingButtonsProps) {
  return (
    <div className="w-full rounded-xl border border-border bg-card/60 p-5 shadow-sm">
      <p className="font-semibold text-muted-foreground text-sm text-center mb-4">
        How well did you know this word?
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {RATING_OPTIONS.map((option) => (
          <button
            key={option.rating}
            type="button"
            onClick={() => onRating(option.rating)}
            disabled={isSubmitting}
            className={cn(
              "group relative flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg",
              "border border-border bg-background/60 transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.15)]",
              "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
              option.hoverBorder,
            )}
          >
            {/* Shortcut key */}
            <kbd className="absolute top-1.5 right-1.5 text-[10px] font-mono text-muted-foreground/50 px-1 py-0.5 rounded border border-border/60 leading-none transition-colors group-hover:text-muted-foreground/80">
              {option.shortcut}
            </kbd>

            <span className={cn("text-sm font-semibold", option.accentColor)}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
