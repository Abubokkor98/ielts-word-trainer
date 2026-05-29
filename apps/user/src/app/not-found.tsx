import { Badge, Button } from '@ielts/ui';
import { BookOpen, Home } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    'The page you are looking for does not exist. Head back to learn IELTS vocabulary.',
};

const SYNONYMS = [
  'missing',
  'vanished',
  'absent',
  'unlocatable',
  'misplaced',
] as const;

export default function NotFound() {
  return (
    <main className="nf-page">
      {/* Noise texture overlay */}
      <div className="nf-noise" aria-hidden="true" />

      <div className="nf-container">
        {/* Error code, floating above the card */}
        <p className="nf-error-code" aria-hidden="true">
          404
        </p>

        {/* Dictionary card with animated border */}
        <div className="nf-card-wrapper">
          <div className="nf-card-border" aria-hidden="true" />
          <article className="nf-card">
            {/* Header row */}
            <header className="nf-card-header">
              <h1 className="nf-word">Page Not Found</h1>
              <span className="nf-pos-badge">noun</span>
            </header>

            {/* Divider */}
            <div className="nf-divider" />

            {/* Definition */}
            <section className="nf-section">
              <span className="nf-label">Definition</span>
              <p className="nf-definition">
                The digital state of being entirely lost; a webpage that has
                vanished like a difficult vocabulary word during an exam. Often
                accompanied by a momentary sense of bewilderment.
              </p>
            </section>

            {/* Example */}
            <section className="nf-section">
              <span className="nf-label">Example</span>
              <blockquote className="nf-example">
                &ldquo;The student searched for the page, but encountered a{' '}
                <em className="nf-em">404 </em> and wisely decided to learn a new
                word instead.&rdquo;
              </blockquote>
            </section>

            {/* Synonyms */}
            <section className="nf-section">
              <span className="nf-label">Synonyms</span>
              <div className="nf-synonyms">
                {SYNONYMS.map((synonym) => (
                  <Badge
                    key={synonym}
                    variant="outline"
                    className="nf-synonym-badge"
                  >
                    {synonym}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Divider */}
            <div className="nf-divider" />

            {/* Actions */}
            <div className="nf-actions">
              <Button asChild variant="outline" className="nf-btn nf-btn--primary">
                <Link href="/">
                  <Home size={16} />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="nf-btn nf-btn--ghost">
                <Link href="/vocabulary">
                  <BookOpen size={16} />
                  Learn Words
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
