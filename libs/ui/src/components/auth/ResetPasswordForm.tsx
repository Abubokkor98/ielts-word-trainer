'use client';

import { axiosInstance } from '@ielts/auth';
import { Button, Card, CardContent, CardHeader, Input, Label, useToast } from '@ielts/ui';
import { useMutation } from '@tanstack/react-query';
import { Key } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ResetPasswordFormProps {
  redirectPath?: string;
  title?: string;
  description?: string;
  apiPrefix?: string;
  icon?: React.ReactNode;
}

export function ResetPasswordForm({
  redirectPath = '/login',
  title = 'Reset Password',
  description = 'Enter your new password',
  apiPrefix = '/password',
  icon = <Key className="h-8 w-8 text-primary" />,
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
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-2">
            {icon}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <Card className="border-border bg-card shadow-2xl glass-card relative z-10">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
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
              </div>

              <div className="space-y-4 pt-2">
                <Button type="submit" className="w-full glow-button" disabled={resetPasswordMutation.isPending}>
                  {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
