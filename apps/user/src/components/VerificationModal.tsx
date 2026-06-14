'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@ielts/ui';
import { useEffect, useRef, useState } from 'react';
import { VerifyView } from './verification/VerifyView';
import { ChangeEmailView } from './verification/ChangeEmailView';

// ============================================================================
// Types
// ============================================================================

type ModalView = 'verify' | 'change-email';

interface VerificationModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const EXIT_ANIMATION_DELAY_MS = 200;

// ============================================================================
// Component
// ============================================================================

export function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
  const [view, setView] = useState<ModalView>('verify');
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setView('verify');
        resetTimerRef.current = null;
      }, EXIT_ANIMATION_DELAY_MS);
      onClose();
    } else if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg p-0 gap-0 overflow-hidden border-border/30 bg-card shadow-2xl rounded-2xl max-h-[90dvh] overflow-y-auto min-h-[420px] flex flex-col">
        <DialogDescription className="sr-only">
          Verify your email to unlock unlimited quizzes and full features.
        </DialogDescription>

        {view === 'verify' ? (
          <VerifyView
            onClose={onClose}
            onChangeEmailClick={() => setView('change-email')}
          />
        ) : (
          <ChangeEmailView
            onBack={() => setView('verify')}
            onSuccess={() => setView('verify')}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
