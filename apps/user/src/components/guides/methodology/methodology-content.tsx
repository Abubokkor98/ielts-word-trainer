'use client';

import { useScrollSpy } from '../../terms/use-scroll-spy';
import { GUIDE_SECTIONS } from './methodology.constants';
import { MethodologyHero } from './methodology-hero';
import { MethodologySections } from './methodology-sections';
import { MethodologySidebar } from './methodology-sidebar';

// ============================================================================
// Component
// ============================================================================

export function MethodologyContent() {
  const sectionIds = GUIDE_SECTIONS.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <MethodologyHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <MethodologySidebar sections={GUIDE_SECTIONS} activeId={activeId} />
        <MethodologySections sections={GUIDE_SECTIONS} />
      </div>
    </div>
  );
}
