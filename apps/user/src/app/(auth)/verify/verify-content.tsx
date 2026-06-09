'use client';

import { Button } from '@ielts/ui';
import { ArrowRight, CheckCircle2, Home, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useVerifyEmail } from 'apps/user/src/features/auth/hooks/use-verify-email';
import type { AxiosError } from 'axios';

export function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail, isVerifying, isSuccess, isError, error } = useVerifyEmail();
  
  const lastSubmittedToken = useRef<string | null>(null);

  useEffect(() => {
    if (!token) return;
    if (lastSubmittedToken.current === token) return;
    
    lastSubmittedToken.current = token;
    verifyEmail(token);
  }, [token, verifyEmail]);

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

  if (isError) {
    const errMessage = (error as AxiosError<{ message: string }>)?.response?.data?.message || 'Verification failed. The link may have expired or the server is unreachable.';
    return <VerifyErrorCard message={errMessage} />;
  }

  // Fallback
  return null;
}

function VerifySuccessCard() {
  return (
    <div className="nf-card-wrapper max-w-md w-full mx-auto">
      <article className="nf-card" style={{ textAlign: 'center' }}>
        <div className="nf-verify-icon nf-verify-icon--primary">
          <CheckCircle2 size={40} />
        </div>

        <h1 className="nf-word" style={{ textAlign: 'center' }}>
          Email Verified!
        </h1>
        <p className="nf-definition" style={{ textAlign: 'center', marginTop: '8px' }}>
          Your email has been successfully verified. You now have full
          access to smart learning reminders and progress tracking.
        </p>

        <div className="nf-divider" />

        <div className="nf-actions">
          <Button asChild variant="outline" className="nf-btn nf-btn--primary">
            <Link href="/dashboard">
              <ArrowRight size={16} />
              Go to Dashboard
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
    <div className="nf-card-wrapper max-w-md w-full mx-auto">
      <article className="nf-card" style={{ textAlign: 'center' }}>
        <div className="nf-verify-icon nf-verify-icon--danger">
          <XCircle size={40} />
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
            <Link href="/dashboard">
              <ArrowRight size={16} />
              Return to Dashboard
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
