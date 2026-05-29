import { CTA } from './components/cta';
import { FeaturesBentoSection } from './components/features-bento';
import { HeroSection } from './components/hero-section';
import { HowItWorksSection } from './components/how-it-works';
import { StatsSection } from './components/stats-section';
import { TestimonialsSection } from './components/testimonials';

export function LandingContainer() {
  return (
    <div className="dark bg-background pb-6 sm:pb-12 flex flex-col gap-12 sm:gap-20 overflow-hidden w-full">
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesBentoSection />
      <TestimonialsSection />
      <CTA />
    </div>
  );
}
