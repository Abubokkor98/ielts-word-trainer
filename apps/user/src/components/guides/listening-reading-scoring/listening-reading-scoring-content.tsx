'use client';

import { useScrollSpy } from '../../terms/use-scroll-spy';
import { GUIDE_SECTIONS } from './listening-reading-scoring.constants';
import { ListeningReadingScoringHero } from './listening-reading-scoring-hero';
import { ListeningReadingScoringSections } from './listening-reading-scoring-sections';
import { ListeningReadingScoringSidebar } from './listening-reading-scoring-sidebar';

// ============================================================================
// Component
// ============================================================================

export function ListeningReadingScoringContent() {
  const sectionIds = GUIDE_SECTIONS.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <ListeningReadingScoringHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <ListeningReadingScoringSidebar sections={GUIDE_SECTIONS} activeId={activeId} />
        <ListeningReadingScoringSections sections={GUIDE_SECTIONS} />
      </div>
    </div>
  );
}
