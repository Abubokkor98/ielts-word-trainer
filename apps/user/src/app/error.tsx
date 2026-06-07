'use client';

import { Button } from '@ielts/ui';
import { RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="nf-page">
      {/* Noise texture overlay */}
      <div className="nf-noise" aria-hidden="true" />

      <div className="nf-container">
        {/* Error code, floating above the card */}
        <p className="nf-error-code nf-error-code--danger" aria-hidden="true">
          500
        </p>

        {/* Dictionary card with animated border */}
        <div className="nf-card-wrapper">
          <div className="nf-card-border" aria-hidden="true" />
          <article className="nf-card">
            {/* Header row */}
            <header className="nf-card-header">
              <h1 className="nf-word text-red-400">Server Error</h1>
              <span className="nf-pos-badge border-red-500/30 text-red-300">
                exception
              </span>
            </header>

            {/* Divider */}
            <div className="nf-divider" />

            {/* Definition */}
            <section className="nf-section">
              <span className="nf-label">Definition</span>
              <p className="nf-definition">
                An unexpected condition encountered by the application; a sudden
                malfunction that disrupts normal operations. Often requires a
                quick refresh or a brief moment of patience.
              </p>
            </section>

            {/* Example */}
            <section className="nf-section">
              <span className="nf-label">Example</span>
              <blockquote className="nf-example !border-red-500/20">
                &ldquo;The request was sound, but alas, the backend threw an{' '}
                <em className="nf-em text-red-400">exception </em> and returned
                an error instead of the vocabulary words.&rdquo;
              </blockquote>
            </section>

            {/* Divider */}
            <div className="nf-divider" />

            {/* Actions */}
            <div className="nf-actions">
              <Button
                onClick={() => reset()}
                variant="outline"
                className="nf-btn w-full justify-center bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300"
              >
                <RotateCcw size={16} />
                Try Again
              </Button>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
