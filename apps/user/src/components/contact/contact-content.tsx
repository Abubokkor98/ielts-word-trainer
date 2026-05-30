'use client';

import { ContactCategories } from './contact-categories';
import { ContactHero } from './contact-hero';
import { ContactInfo } from './contact-info';
import { ContactTips } from './contact-tips';

// ============================================================================
// Component
// ============================================================================

export function ContactContent() {
  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <ContactHero />
      <ContactInfo />
      <ContactCategories />
      <ContactTips />
    </div>
  );
}
