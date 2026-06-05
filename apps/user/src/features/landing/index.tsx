import { CTA } from './components/cta';
import { ExploreTopicsSection } from './components/explore-topics-section';
import { FaqSection } from './components/faq-section';
import { FeaturesBentoSection } from './components/features-bento';
import { HeroSection } from './components/hero-section';
import { HowItWorksSection } from './components/how-it-works';
import { IeltsVocabGuideSection } from './components/ielts-vocab-guide-section';
import { StatsSection } from './components/stats-section';
import { TestimonialsSection } from './components/testimonials';

export function LandingContainer() {
  return (
    <div className="dark bg-background pb-6 sm:pb-12 flex flex-col overflow-hidden w-full">
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesBentoSection />
      <ExploreTopicsSection />
      <IeltsVocabGuideSection />
      <TestimonialsSection />
      <FaqSection />
      <CTA />
    </div>
  );
}
