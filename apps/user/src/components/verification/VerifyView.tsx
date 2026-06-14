import { Button, DialogTitle } from '@ielts/ui';
import { CheckCircle2, Lock, Mail, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@ielts/auth';
import { useVerificationResend } from '../../features/auth/hooks/use-verification-resend';

// ============================================================================
// Types
// ============================================================================

interface VerifyViewProps {
  readonly onClose: () => void;
  readonly onChangeEmailClick: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const BENEFITS = [
  { icon: Sparkles, label: 'Unlimited quizzes' },
  { icon: TrendingUp, label: 'Full progress tracking' },
  { icon: Target, label: 'Detailed analytics' },
] as const;

// ============================================================================
// Component
// ============================================================================

export function VerifyView({ onClose, onChangeEmailClick }: VerifyViewProps) {
  const user = useAuthStore((state) => state.user);
  const { sendVerification, isPending, cooldown, isAllowed } = useVerificationResend();

  return (
    <div className="flex flex-col flex-1">
      {/* Compact Header */}
      <header className="px-4 sm:px-6 pt-5 sm:pt-6 pb-0 flex flex-col items-center gap-2.5 sm:gap-3">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <div className="text-center">
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Unlock Full Access
          </DialogTitle>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed max-w-xs mx-auto">
            Verify your email to remove daily limits and unlock your complete IELTS prep toolkit.
          </p>
        </div>
      </header>

      {/* Benefits — compact horizontal chips */}
      <section className="px-4 sm:px-6 pt-3 sm:pt-4" aria-label="Benefits of verifying">
        <ul className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-1 sm:gap-1.5 bg-primary/8 border border-primary/15 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5"
            >
              <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-medium text-foreground/85">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Email + CTA */}
      <footer className="px-4 sm:px-6 pb-5 sm:pb-6 pt-3 sm:pt-4 flex flex-col gap-2.5 sm:gap-3 mt-auto">
        {/* Email indicator */}
        <figure className="flex items-center gap-2 sm:gap-2.5 rounded-lg bg-muted/15 border border-border/30 px-2.5 sm:px-3.5 py-2 sm:py-2.5">
          <span className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-semibold leading-none mb-0.5">
              Sending to
            </p>
            <p className="text-xs sm:text-sm font-medium text-foreground truncate">
              {user?.email}
            </p>
          </div>
        </figure>

        {/* Primary CTA */}
        <Button
          className="w-full font-semibold text-xs sm:text-sm"
          size="default"
          onClick={sendVerification}
          disabled={!isAllowed}
        >
          {cooldown > 0 ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Resend in {cooldown}s
            </span>
          ) : isPending ? (
            'Sending…'
          ) : (
            'Send Verification Link'
          )}
        </Button>

        {/* Secondary actions */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-[10.5px] text-muted-foreground/60">
            Incorrect email?{' '}
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={onChangeEmailClick}
              className="text-[10.5px] text-muted-foreground hover:text-primary h-auto p-0 font-medium underline underline-offset-2"
            >
              Change it
            </Button>
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-[10.5px] text-muted-foreground hover:text-foreground h-7 px-2"
            onClick={onClose}
          >
            Maybe later
          </Button>
        </div>
      </footer>
    </div>
  );
}
