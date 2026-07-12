interface GuideLastUpdatedProps {
  readonly dateModified: string;
}

/**
 * Small "Last updated" text displayed at the bottom of guide pages.
 * Provides a visible freshness signal for both users and AI systems.
 */
export function GuideLastUpdated({ dateModified }: GuideLastUpdatedProps) {
  const formattedDate = new Date(dateModified).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container max-w-4xl mx-auto px-6 pt-10 pb-4 mt-8">
      <div className="border-t border-zinc-800 pt-4">
        <p className="text-[11px] text-zinc-600 font-mono text-right tracking-wide">
          Last updated: {formattedDate}
        </p>
      </div>
    </div>
  );
}
