'use client';

import { AboutBentoSection } from './about-bento';
import { AboutDeveloper } from './about-developer';
import { AboutDisclaimer } from './about-disclaimer';
import { AboutGuarantees } from './about-guarantees';
import { AboutHero } from './about-hero';

export function AboutContent() {
  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <AboutHero />
      <AboutBentoSection />
      <AboutGuarantees />
      <AboutDeveloper />
      <AboutDisclaimer />
    </div>
  );
}
