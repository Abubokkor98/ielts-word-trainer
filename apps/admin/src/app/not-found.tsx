'use client';

import { Button } from '@ielts/ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="max-w-md w-full px-6 text-center space-y-8">
        <h1 className="text-8xl font-extrabold text-primary tracking-tighter">
          404
        </h1>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            The resource you are looking for does not exist or has been moved.
          </p>
        </div>

        <div>
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/dashboard">
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
