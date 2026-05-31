'use client';

import { TERMS_SECTIONS } from './terms.constants';
import { TermsHero } from './terms-hero';
import { TermsSections } from './terms-sections';
import { ScrollspySidebar } from '../ui/scrollspy-sidebar';
import { useScrollSpy } from './use-scroll-spy';

// ============================================================================
// Component
// ============================================================================

export function TermsContent() {
  const sectionIds = TERMS_SECTIONS.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <TermsHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <ScrollspySidebar sections={TERMS_SECTIONS} activeId={activeId} ariaLabel="Terms and Conditions Table of Contents" />
        <TermsSections sections={TERMS_SECTIONS} />
      </div>
    </div>
  );
}
