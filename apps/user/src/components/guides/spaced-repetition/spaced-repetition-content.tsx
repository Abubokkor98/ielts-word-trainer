'use client';

import { useScrollSpy } from '../../terms/use-scroll-spy';
import { GUIDE_SECTIONS } from './spaced-repetition.constants';
import { SpacedRepetitionHero } from './spaced-repetition-hero';
import { SpacedRepetitionSections } from './spaced-repetition-sections';
import { ScrollspySidebar } from '../../ui/scrollspy-sidebar';

// ============================================================================
// Component
// ============================================================================

export function SpacedRepetitionContent() {
  const sectionIds = GUIDE_SECTIONS.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <SpacedRepetitionHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <ScrollspySidebar sections={GUIDE_SECTIONS} activeId={activeId} ariaLabel="Spaced Repetition Table of Contents" />
        <SpacedRepetitionSections sections={GUIDE_SECTIONS} />
      </div>
    </div>
  );
}
