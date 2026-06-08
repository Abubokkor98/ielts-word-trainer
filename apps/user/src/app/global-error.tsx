'use client';

import { useEffect } from 'react';
import './global.css';
import { ErrorUI } from '../components/ErrorUI';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Critical Global Error:', error);
  }, [error]);

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ErrorUI reset={reset} />
      </body>
    </html>
  );
}
