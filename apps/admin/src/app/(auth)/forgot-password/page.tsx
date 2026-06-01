'use client';

import { axiosInstance } from '@ielts/auth';
import { Button, Card, CardContent, Input, Label, useToast } from '@ielts/ui';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const forgotPasswordMutation = useMutation<{ success: boolean }, AxiosError>({
    mutationFn: async () => {
      const { data } = await axiosInstance.post('/admin/password/request-reset', {
        email,
      });
      return data;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: 'Email sent!',
        description: 'Check your inbox for reset instructions.',
      });
    },
    onError: (error: AxiosError) => {
      const err = error as unknown as ErrorResponse;
      toast({
        title: 'Failed to send email',
        description: err.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgotPasswordMutation.mutate();
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 mx-auto mb-4">
            <Mail className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Check Your Email
          </h1>
          <p className="text-sm text-muted-foreground">
            We've sent password reset instructions to <span className="font-medium text-foreground">{email}</span>
          </p>

          <Card className="border-border bg-card shadow-2xl glass-card mt-8">
            <CardContent className="pt-6">
              <Button asChild className="w-full glow-button">
                <Link href="/login">Return to login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-2">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Forgot Password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your admin email to reset your password
          </p>
        </div>

        <Card className="border-border bg-card shadow-2xl glass-card">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
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
                    placeholder="admin@email.com"
                    required
                    className="bg-background text-foreground border-input"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2 flex flex-col items-center">
                <Button type="submit" className="w-full glow-button" disabled={forgotPasswordMutation.isPending}>
                  {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <Link href="/login" className="text-sm font-semibold text-primary hover:underline transition-colors mt-2">
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
