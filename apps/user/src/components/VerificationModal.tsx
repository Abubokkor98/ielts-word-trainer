'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@ielts/ui';
import { CheckCircle2, Mail, Shield, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useAuthStore } from '@ielts/auth';
import { useToast } from '@ielts/ui';
import { authApi } from '../features/auth/services/auth.api';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BENEFITS = [
  { icon: Sparkles, label: 'Unlimited daily quizzes' },
  { icon: TrendingUp, label: 'Track streaks, XP & progress' },
  { icon: Target, label: 'Detailed performance analytics' },
] as const;

export function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
  const user = useAuthStore((state) => state.user);
  const { toast } = useToast();
  const [isSent, setIsSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSendVerification = () => {
    if (!user) return;

    startTransition(async () => {
      try {
        const response = await authApi.sendVerification(user.email);
        if (response.success) {
          setIsSent(true);
          sessionStorage.setItem('lastVerificationResend', Date.now().toString());
          toast({
            title: 'Magic Link Sent!',
            description: 'Please check your inbox to verify your email.',
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
          'Failed to send verification email';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm p-0 gap-0 overflow-hidden border-border/40 bg-[#1b1722] shadow-2xl rounded-xl max-h-[90dvh] overflow-y-auto">
        <DialogDescription className="sr-only">
          Verify your email to unlock unlimited quizzes and full features.
        </DialogDescription>

        {/* Header Banner */}
        <header className="relative h-20 w-full bg-primary/8 flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1722] to-transparent pointer-events-none" />
          <div className="h-11 w-11 bg-primary/15 rounded-full flex items-center justify-center relative z-10 border border-primary/25 animate-in zoom-in duration-500">
            <Shield className="h-5 w-5 text-primary" />
          </div>
        </header>

        {/* Body */}
        <section className="px-5 pb-1">
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground text-center">
            Verify to Keep Practicing
          </DialogTitle>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 text-center leading-relaxed">
            Unverified accounts are limited to 1 quiz per day. A quick email verification
            unlocks your full IELTS prep toolkit.
          </p>

          {/* Benefits List */}
          <ul className="mt-3.5 space-y-2">
            {BENEFITS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5"
              >
                <span className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-3 w-3 text-primary" />
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-foreground/90">{label}</span>
              </li>
            ))}
          </ul>

          {/* Email Indicator */}
          <figure className="mt-3.5 bg-muted/20 rounded-lg p-2.5 flex items-center gap-2.5 border border-border/40">
            <span className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="h-3.5 w-3.5 text-primary" />
            </span>
            <span className="flex-1 text-[11px] sm:text-xs font-medium text-foreground truncate">
              {user?.email}
            </span>
          </figure>
        </section>

        {/* Footer Actions */}
        <footer className="px-5 pb-5 pt-3.5 flex flex-col gap-2">
          <Button
            className="w-full font-semibold text-xs sm:text-sm"
            size="lg"
            onClick={handleSendVerification}
            disabled={isPending || isSent}
          >
            {isSent ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Verification Link Sent
              </span>
            ) : isPending ? (
              'Sending...'
            ) : (
              'Verify My Email'
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-foreground text-[11px]"
            onClick={onClose}
          >
            Maybe Later
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
