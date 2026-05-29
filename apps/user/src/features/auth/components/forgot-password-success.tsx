'use client';

import { Button, Card, CardContent, CardHeader } from '@ielts/ui';
import Link from 'next/link';

interface ForgotPasswordSuccessUIProps {
  email: string;
}

export function ForgotPasswordSuccessUI({ email }: ForgotPasswordSuccessUIProps) {
  return (
    <Card className="w-full max-w-md p-8 bg-card border-border">
      <CardHeader className="p-0 pb-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold text-primary animate-pulse">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We have sent a password reset link to <br />
            <span className="font-bold text-foreground">
              {email}
            </span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col gap-6">
          <p className="text-sm text-muted-foreground/80 text-center">
            Did not receive the email? Check your spam folder or try another email address.
          </p>
          <Button variant="outline" className="w-full border-input text-foreground hover:bg-accent" onClick={() => window.location.reload()}>
            Try again
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/login" className="text-primary hover:underline font-bold transition-colors">
              Login
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
