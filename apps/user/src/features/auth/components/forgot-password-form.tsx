'use client';

import { Button, Card, CardContent, CardHeader, Input, Label } from '@ielts/ui';
import Link from 'next/link';
import { useState } from 'react';
import { usePasswordRecovery } from '../hooks/use-password-recovery';
import { ForgotPasswordSuccessUI } from './forgot-password-success';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const { forgotPassword, isForgotPasswordPending, isForgotPasswordSuccess } =
    usePasswordRecovery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword({ email });
  };

  if (isForgotPasswordSuccess) {
    return <ForgotPasswordSuccessUI email={email} />;
  }

  return (
    <Card className="w-full max-w-md p-8 bg-card border-border">
      <CardHeader className="p-0 pb-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Forgot Password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a reset link
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="bg-background text-foreground border-input"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isForgotPasswordPending}>
              {isForgotPasswordPending ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link href="/login" className="text-primary hover:underline font-bold transition-colors">
                Login
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
