'use client';

import { Button, Card, CardContent, CardHeader, Input, Label, PasswordInput, useToast } from '@ielts/ui';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { usePasswordRecovery } from '../hooks/use-password-recovery';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const token = searchParams.get('token') || '';

  const { resetPassword, isResetPasswordPending } = usePasswordRecovery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    resetPassword({ token, password });
  };

  if (!token) {
    return (
      <Card className="w-full max-w-md p-8 bg-card border-border">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-destructive font-semibold">Invalid or missing reset token.</p>
            <Link href="/login" className="text-primary hover:underline transition-colors">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md p-8 bg-card border-border">
      <CardHeader className="p-0 pb-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-semibold text-muted-foreground">
                New Password
              </Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className="font-semibold text-muted-foreground">
                Confirm Password
              </Label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isResetPasswordPending}>
              {isResetPasswordPending ? 'Resetting...' : 'Reset Password'}
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
