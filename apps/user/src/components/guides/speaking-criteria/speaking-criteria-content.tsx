'use client';

import { useScrollSpy } from '../../terms/use-scroll-spy';
import { GUIDE_SECTIONS } from './speaking-criteria.constants';
import { SpeakingCriteriaHero } from './speaking-criteria-hero';
import { SpeakingCriteriaSections } from './speaking-criteria-sections';
import { SpeakingCriteriaSidebar } from './speaking-criteria-sidebar';

// ============================================================================
// Component
// ============================================================================

export function SpeakingCriteriaContent() {
  const sectionIds = GUIDE_SECTIONS.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <SpeakingCriteriaHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <SpeakingCriteriaSidebar sections={GUIDE_SECTIONS} activeId={activeId} />
        <SpeakingCriteriaSections sections={GUIDE_SECTIONS} />
      </div>
    </div>
  );
}
