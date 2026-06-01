'use client';

import { Button, Card, CardContent, CardHeader, Input, Label, PasswordInput } from '@ielts/ui';
import Link from 'next/link';
import { useState } from 'react';
import { useLogin } from '../hooks/use-login';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <Card className="w-full max-w-md p-8 bg-card border-border">
      <CardHeader className="p-0 pb-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome Back!
          </h1>
          <p className="text-sm text-muted-foreground">
            Login to continue your learning journey
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

            <div className="grid gap-2">
              <Label htmlFor="password" className="font-semibold text-muted-foreground">
                Password
              </Label>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <Link href="/forgot-password" className="text-primary hover:underline font-semibold transition-colors">
                Forgot password?
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline font-bold transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
