'use client';

import { FeedbackCategories } from './feedback-categories';
import { FeedbackForm } from './feedback-form';
import { FeedbackHero } from './feedback-hero';
import { FeedbackUsage } from './feedback-usage';

// ============================================================================
// Component
// ============================================================================

export function FeedbackContent() {
  return (
    <div className="container max-w-[1024px] px-6 mx-auto relative z-10">
      <FeedbackHero />
      
      {/* Form rendered immediately after Hero */}
      <div className="mb-16">
        <FeedbackForm />
      </div>

      {/* Guide Bento Grid rendered after Form */}
      <FeedbackCategories />

      {/* Usage Process Roadmap rendered after Guide */}
      <FeedbackUsage />
    </div>
  );
}
