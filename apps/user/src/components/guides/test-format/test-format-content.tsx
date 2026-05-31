'use client';

import { useScrollSpy } from '../../terms/use-scroll-spy';
import { GUIDE_SECTIONS } from './test-format.constants';
import { TestFormatHero } from './test-format-hero';
import { TestFormatSections } from './test-format-sections';
import { ScrollspySidebar } from '../../ui/scrollspy-sidebar';

// ============================================================================
// Component
// ============================================================================

export function TestFormatContent() {
  const sectionIds = GUIDE_SECTIONS.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <TestFormatHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <ScrollspySidebar sections={GUIDE_SECTIONS} activeId={activeId} ariaLabel="Test Format Table of Contents" />
        <TestFormatSections sections={GUIDE_SECTIONS} />
      </div>
    </div>
  );
}
