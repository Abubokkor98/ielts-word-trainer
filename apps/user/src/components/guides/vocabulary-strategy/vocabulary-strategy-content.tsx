'use client';

import { useScrollSpy } from '../../terms/use-scroll-spy';
import { GUIDE_SECTIONS } from './vocabulary-strategy.constants';
import { VocabularyStrategyHero } from './vocabulary-strategy-hero';
import { VocabularyStrategySections } from './vocabulary-strategy-sections';
import { ScrollspySidebar } from '../../ui/scrollspy-sidebar';

// ============================================================================
// Component
// ============================================================================

export function VocabularyStrategyContent() {
  const sectionIds = GUIDE_SECTIONS.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <VocabularyStrategyHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <ScrollspySidebar sections={GUIDE_SECTIONS} activeId={activeId} ariaLabel="Vocabulary Strategy Table of Contents" />
        <VocabularyStrategySections sections={GUIDE_SECTIONS} />
      </div>
    </div>
  );
}
