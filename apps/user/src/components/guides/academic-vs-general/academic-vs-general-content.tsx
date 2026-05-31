'use client';

import { useScrollSpy } from '../../terms/use-scroll-spy';
import { GUIDE_SECTIONS } from './academic-vs-general.constants';
import { AcademicVsGeneralHero } from './academic-vs-general-hero';
import { AcademicVsGeneralSections } from './academic-vs-general-sections';
import { ScrollspySidebar } from '../../ui/scrollspy-sidebar';

// ============================================================================
// Component
// ============================================================================

export function AcademicVsGeneralContent() {
  const sectionIds = GUIDE_SECTIONS.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <AcademicVsGeneralHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <ScrollspySidebar sections={GUIDE_SECTIONS} activeId={activeId} ariaLabel="Academic vs General Table of Contents" />
        <AcademicVsGeneralSections sections={GUIDE_SECTIONS} />
      </div>
    </div>
  );
}
