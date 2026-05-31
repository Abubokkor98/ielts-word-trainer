'use client';

import { useScrollSpy } from '../../terms/use-scroll-spy';
import { GUIDE_SECTIONS } from './writing-criteria.constants';
import { WritingCriteriaHero } from './writing-criteria-hero';
import { WritingCriteriaSections } from './writing-criteria-sections';
import { ScrollspySidebar } from '../../ui/scrollspy-sidebar';

// ============================================================================
// Component
// ============================================================================

export function WritingCriteriaContent() {
  const sectionIds = GUIDE_SECTIONS.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <WritingCriteriaHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <ScrollspySidebar sections={GUIDE_SECTIONS} activeId={activeId} ariaLabel="Writing Criteria Table of Contents" />
        <WritingCriteriaSections sections={GUIDE_SECTIONS} />
      </div>
    </div>
  );
}
