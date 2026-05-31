'use client';

import { useScrollSpy } from '../../terms/use-scroll-spy';
import { GUIDE_SECTIONS } from './listening-reading-scoring.constants';
import { ListeningReadingScoringHero } from './listening-reading-scoring-hero';
import { ListeningReadingScoringSections } from './listening-reading-scoring-sections';
import { ScrollspySidebar } from '../../ui/scrollspy-sidebar';

// ============================================================================
// Constants
// ============================================================================

const SECTION_IDS = GUIDE_SECTIONS.map((section) => section.id);

// ============================================================================
// Component
// ============================================================================

export function ListeningReadingScoringContent() {
  const activeId = useScrollSpy(SECTION_IDS);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <ListeningReadingScoringHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <ScrollspySidebar sections={GUIDE_SECTIONS} activeId={activeId} ariaLabel="Listening & Reading Scoring Table of Contents" />
        <ListeningReadingScoringSections sections={GUIDE_SECTIONS} />
      </div>
    </div>
  );
}
