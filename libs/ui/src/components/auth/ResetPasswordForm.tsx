'use client';

import { Button, Card, CardContent, CardHeader, Input, Label, useToast } from '@ielts/ui';
import { axiosInstance } from '@ielts/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ResetPasswordFormProps {
  redirectPath?: string;
  title?: string;
  description?: string;
  apiPrefix?: string;
}

export function ResetPasswordForm({
  redirectPath = '/login',
  title = 'Reset Password',
  description = 'Enter your new password',
  apiPrefix = '/password',
}: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast({
        title: 'Invalid reset link',
        description: 'Please request a new password reset',
        variant: 'destructive',
      });
      router.push('/forgot-password');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, router, toast]);

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const { data } = await axiosInstance.post(`${apiPrefix}/reset-password`, {
        token,
        password,
      });
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Password reset successful!',
        description: 'You can now login with your new password.',
      });
      setTimeout(() => router.push(redirectPath), 2000);
    },
    onError: (error: any) => {
      toast({
        title: 'Reset failed',
        description: error.response?.data?.message || 'Invalid or expired token',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({ title: 'Password too short (min 6 chars)', variant: 'destructive' });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    resetPasswordMutation.mutate({ token, password: newPassword });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4 relative overflow-hidden w-full">
      {/* Subtle glow effects for premium look */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md p-8 bg-card border-border relative z-10">
        <CardHeader className="p-0 pb-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="newPassword" className="font-semibold text-muted-foreground">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="bg-background text-foreground border-input"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="font-semibold text-muted-foreground">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="bg-background text-foreground border-input"
                />
              </div>

              <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
