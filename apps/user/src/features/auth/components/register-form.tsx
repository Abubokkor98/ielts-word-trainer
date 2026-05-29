'use client';

import { Button, Card, CardContent, CardHeader, Input, Label } from '@ielts/ui';
import Link from 'next/link';
import { useState } from 'react';
import { useRegister } from '../hooks/use-register';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password });
  };

  return (
    <Card className="w-full max-w-md p-8 bg-card border-border">
      <CardHeader className="p-0 pb-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Start your IELTS vocabulary journey
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold text-muted-foreground">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="bg-background text-foreground border-input"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                className="bg-background text-foreground border-input"
              />
            </div>

            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Signing up...' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
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
