'use client';

import { axiosInstance, useAuthStore } from '@ielts/auth';
import { Button, Card, CardContent, Input, Label, PasswordInput, useToast } from '@ielts/ui';
import { useMutation } from '@tanstack/react-query';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { setUser, setToken } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(
        '/admin/login',
        {
          email,
          password,
        },
        { timeout: 10000 }
      );

      if (!data || !data.accessToken || !data.data || !data.data.role) {
        throw new Error('Invalid response structure from server');
      }

      return data;
    },
    onSuccess: async (data) => {
      setToken(data.accessToken);
      setUser(data.data);

      // Verify cookies were set correctly by backend
      try {
        const cookieCheck = await axiosInstance.get('/auth/verify-cookies', {
          timeout: 3000,
        });
        if (!cookieCheck.data?.data?.cookiesValid) {
          toast({
            title: 'Warning: Session may not persist',
            description: 'Cookies were not set correctly. You may be logged out on refresh.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.warn('Cookie verification failed:', error);
      }

      toast({
        title: 'Login successful!',
        description: `Welcome back, ${data.data.name}!`,
      });

      router.push('/dashboard');
    },
    onError: (error: Error | { response?: { data?: { message?: string } } }) => {
      toast({
        title: 'Login failed',
        description: ('response' in error && error.response?.data?.message) || 'Invalid credentials',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-2">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Secure login for administrators only
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

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-semibold text-muted-foreground">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-primary hover:underline transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <PasswordInput
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  type="submit"
                  className="w-full glow-button"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Logging in...' : 'Admin Login'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary/20 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all"
                  onClick={() => {
                    setEmail('demo@admin.com');
                    setPassword('demo123');
                  }}
                >
                  🎯 Try Demo Credentials (Read-Only)
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Regular user?{' '}
          <Link
            href={process.env.NEXT_PUBLIC_USER_APP_URL || 'http://localhost:3000'}
            className="text-primary font-semibold hover:underline transition-colors"
          >
            Go to User Portal
          </Link>
        </p>
      </div>
    </main>
  );
}
