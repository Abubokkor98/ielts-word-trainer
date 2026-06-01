'use client';

import { selectIsAuthenticated, useAuthStore } from '@ielts/auth';
import { Button } from '@ielts/ui';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminHomePage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;

    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router, hasHydrated]);

  if (!hasHydrated) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <section className="max-w-md w-full text-center space-y-8 px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            IELTS Admin Portal
          </h1>
          <p className="text-lg text-muted-foreground">
            Secure administration dashboard
          </p>
        </div>

        <Button asChild size="lg" className="px-12 glow-button">
          <Link href="/login">Login</Link>
        </Button>
      </section>
    </main>
  );
}
