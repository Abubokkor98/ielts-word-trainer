'use client';

import { useScrollSpy } from '../../terms/use-scroll-spy';
import { GUIDE_SECTIONS } from './band-scores.constants';
import { BandScoresHero } from './band-scores-hero';
import { BandScoresSections } from './band-scores-sections';
import { ScrollspySidebar } from '../../ui/scrollspy-sidebar';

// ============================================================================
// Component
// ============================================================================

export function BandScoresContent() {
  const sectionIds = GUIDE_SECTIONS.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <BandScoresHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <ScrollspySidebar sections={GUIDE_SECTIONS} activeId={activeId} ariaLabel="Band Scores Table of Contents" />
        <BandScoresSections sections={GUIDE_SECTIONS} />
      </div>
    </div>
  );
}
