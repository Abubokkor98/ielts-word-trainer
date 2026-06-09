'use client';

import { Button } from '@ielts/ui';
import { useVerifyEmailChange } from 'apps/user/src/features/auth/hooks/use-change-email';
import type { AxiosError } from 'axios';
import { CheckCircle2, Home, LogIn, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function VerifyEmailChangeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmailChange, isVerifying, isSuccess, error } = useVerifyEmailChange();

  const lastSubmittedToken = useRef<string | null>(null);

  useEffect(() => {
    if (!token) return;
    if (lastSubmittedToken.current === token) return;

    lastSubmittedToken.current = token;
    verifyEmailChange(token).catch((err) => {
      console.error('Email change verification failed:', err);
    });
  }, [token, verifyEmailChange]);

  if (!token) {
    return <VerifyErrorCard message="Verification token is missing from the URL." />;
  }

  if (isVerifying) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isSuccess) {
    return <VerifySuccessCard />;
  }

  if (error) {
    const errMessage =
      (error as AxiosError<{ message: string }>)?.response?.data?.message ||
      'Verification failed. The link may have expired or the server is unreachable.';
    return <VerifyErrorCard message={errMessage} />;
  }

  // Fallback loading state
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function VerifySuccessCard() {
  return (
    <div className="nf-card-wrapper max-w-md w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <article className="nf-card animate-shadow" style={{ textAlign: 'center' }}>
        <div className="nf-verify-icon nf-verify-icon--primary">
          <CheckCircle2 size={40} className="text-primary" />
        </div>

        <h1 className="nf-word" style={{ textAlign: 'center' }}>
          Email Changed!
        </h1>
        <p className="nf-definition" style={{ textAlign: 'center', marginTop: '8px' }}>
          Your email address has been successfully updated. For security, we've logged you out of
          all active sessions. Please log in again using your new email address.
        </p>

        <div className="nf-divider" />

        <div className="nf-actions">
          <Button asChild variant="outline" className="nf-btn nf-btn--primary">
            <Link href="/login">
              <LogIn size={16} />
              Log In Now
            </Link>
          </Button>
          <Button asChild variant="outline" className="nf-btn nf-btn--ghost">
            <Link href="/">
              <Home size={16} />
              Go Home
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
}

interface ErrorCardProps {
  message: string;
}

function VerifyErrorCard({ message }: ErrorCardProps) {
  return (
    <div className="nf-card-wrapper max-w-md w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <article className="nf-card" style={{ textAlign: 'center' }}>
        <div className="nf-verify-icon nf-verify-icon--danger">
          <XCircle size={40} className="text-destructive" />
        </div>

        <h1 className="nf-word nf-word--danger" style={{ textAlign: 'center' }}>
          Verification Failed
        </h1>
        <p className="nf-definition" style={{ textAlign: 'center', marginTop: '8px' }}>
          {message}
        </p>

        <div className="nf-divider" />

        <div className="nf-actions">
          <Button asChild variant="outline" className="nf-btn nf-btn--primary">
            <Link href="/login">
              <LogIn size={16} />
              Go to Login
            </Link>
          </Button>
          <Button asChild variant="outline" className="nf-btn nf-btn--ghost">
            <Link href="/">
              <Home size={16} />
              Go Home
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
