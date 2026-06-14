import { useToast } from '@ielts/ui';
import { useAuthStore } from '@ielts/auth';
import { useState, useEffect, useCallback, useTransition } from 'react';
import { authApi } from '../services/auth.api';

import type { AxiosError } from 'axios';

const COOLDOWN_SECONDS = 60;
const STORAGE_KEY = 'lastVerificationResend';

export function useVerificationResend() {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  
  const [cooldown, setCooldown] = useState(() => {
    if (typeof window === 'undefined') return 0;
    
    const lastResend = sessionStorage.getItem(STORAGE_KEY);
    if (!lastResend) return 0;

    const elapsed = Math.floor((Date.now() - parseInt(lastResend, 10)) / 1000);
    return elapsed < COOLDOWN_SECONDS ? COOLDOWN_SECONDS - elapsed : 0;
  });
  
  const [isPending, startTransition] = useTransition();

  // Timer countdown
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const sendVerification = useCallback(() => {
    if (!user || cooldown > 0) return;

    startTransition(async () => {
      try {
        const response = await authApi.sendVerification(user.email);
        if (response.success) {
          setCooldown(COOLDOWN_SECONDS);
          sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
          toast({
            title: 'Verification Link Sent!',
            description: 'Please check your inbox to verify your email.',
          });
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message || 'Failed to send verification email';
        toast({
          title: 'Request failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    });
  }, [user, cooldown, toast]);

  return {
    sendVerification,
    isPending,
    cooldown,
    isAllowed: cooldown === 0 && !isPending,
  };
}
