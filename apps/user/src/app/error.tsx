'use client';

import { useEffect } from 'react';
import { ErrorUI } from '../components/ErrorUI';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    +(
      // Log the error to console (TODO: integrate with error reporting service)

      console.error(error)
    );
  }, [error]);

  return <ErrorUI reset={reset} />;
}
