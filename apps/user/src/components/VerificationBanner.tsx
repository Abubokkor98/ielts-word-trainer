'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { useAuthStore } from '@ielts/auth';
import { Mail, CheckCircle2, X } from 'lucide-react';
import { AxiosError } from 'axios';
import { authApi } from '../features/auth/services/auth.api';
import { Button, useToast } from '@ielts/ui';

export default function VerificationBanner() {
  const user = useAuthStore((state) => state.user);
  const [isVisible, setIsVisible] = useState(true);
  const [isSent, setIsSent] = useState(false);
  const [isNewlyRegistered, setIsNewlyRegistered] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setIsVisible(true);
  }, [user?.id]);
  
  // React 19 best practice: useTransition for async UI interactions
  const [isPending, startTransition] = useTransition();
  const bannerRef = useRef<HTMLElement>(null);

  // Read session storage on mount
  useEffect(() => {
    if (sessionStorage.getItem('justRegistered') === 'true') {
      setIsNewlyRegistered(true);
      // Clean up immediately so it doesn't persist if they log out and log back in
      sessionStorage.removeItem('justRegistered');
    }

    const lastSent = sessionStorage.getItem('lastVerificationResend');
    if (lastSent) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSent, 10)) / 1000);
      if (elapsed < 60) {
        setCooldown(60 - elapsed);
        setIsSent(true);
      }
    }
  }, []);

  // Cooldown timer logic
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (!user || user.isEmailVerified || !isVisible || !bannerRef.current) {
      document.documentElement.style.setProperty('--banner-height', '0px');
      return;
    }

    const updateHeight = () => {
      if (bannerRef.current) {
        document.documentElement.style.setProperty('--banner-height', `${bannerRef.current.offsetHeight}px`);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(bannerRef.current);
    updateHeight();

    return () => {
      resizeObserver.disconnect();
      document.documentElement.style.setProperty('--banner-height', '0px');
    };
  }, [user, isVisible]);

  // If no user, or user is verified, or banner is closed -> render nothing
  if (!user || user.isEmailVerified || !isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSendVerification = () => {
    startTransition(async () => {
      try {
        const response = await authApi.sendVerification(user.email);
        
        if (response.success) {
          setIsSent(true);
          setCooldown(60);
          sessionStorage.setItem('lastVerificationResend', Date.now().toString());
          toast({
            title: 'Magic Link Sent!',
            description: 'Please check your inbox to verify your email.',
          });
        }
      } catch (error: unknown) {
        let message = 'Failed to send verification email';
        if (error instanceof AxiosError) {
          message = error.response?.data?.message || message;
        }
        
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      }
    });
  };

  const isStateA = isNewlyRegistered || isSent;

  return (
    <aside 
      ref={bannerRef}
      className="w-full bg-primary border-b border-primary-foreground/10 text-primary-foreground px-4 py-2 sticky top-0 z-[2000] transition-all duration-300"
      aria-label="Email Verification Reminder"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between pr-8 relative">
        <div className="flex items-start sm:items-center gap-2.5 w-full">
          <div className="p-1.5 bg-primary-foreground/20 rounded-full shrink-0 mt-0.5 sm:mt-0" aria-hidden="true">
            <Mail className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
            {isStateA ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                <p className="font-medium text-xs sm:text-sm leading-tight">Welcome!</p>
                <span className="hidden sm:inline text-primary-foreground/60">-</span>
                <p className="text-[10px] sm:text-xs text-primary-foreground/80 leading-tight">
                  We've automatically sent a verification link to your email. Please check your inbox.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                <p className="font-medium text-xs sm:text-sm leading-tight">Verify your email address</p>
                <span className="hidden sm:inline text-primary-foreground/60">-</span>
                <p className="text-[10px] sm:text-xs text-primary-foreground/80 leading-tight">
                  Turn on smart learning reminders to boost your vocabulary.
                </p>
              </div>
            )}

            <Button
              onClick={handleSendVerification}
              disabled={isPending || cooldown > 0}
              size="sm"
              variant="secondary"
              className="h-7 text-xs px-3 whitespace-nowrap bg-background text-foreground hover:bg-background/90 w-fit shrink-0"
            >
              {cooldown > 0 ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Sent ({cooldown}s)
                </span>
              ) : isPending ? (
                'Sending...'
              ) : isStateA ? (
                'Resend Magic Link'
              ) : (
                'Send Magic Link'
              )}
            </Button>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleClose}
          className="h-6 w-6 absolute right-0 top-1/2 -translate-y-1/2 text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/10 shrink-0"
          aria-label="Close verification banner"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </aside>
  );
}
