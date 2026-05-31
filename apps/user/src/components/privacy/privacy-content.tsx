'use client';

import { useScrollSpy } from '../terms/use-scroll-spy';
import { PRIVACY_SECTIONS } from './privacy.constants';
import { PrivacyHero } from './privacy-hero';
import { PrivacySections } from './privacy-sections';
import { ScrollspySidebar } from '../ui/scrollspy-sidebar';

// ============================================================================
// Component
// ============================================================================

export function PrivacyContent() {
  const sectionIds = PRIVACY_SECTIONS.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <PrivacyHero />
      <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
        <ScrollspySidebar sections={PRIVACY_SECTIONS} activeId={activeId} ariaLabel="Privacy Policy Table of Contents" />
        <PrivacySections sections={PRIVACY_SECTIONS} />
      </div>
    </div>
  );
}
