'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  PasswordInput,
  useToast,
} from '@ielts/ui';
import type { AxiosError } from 'axios';
import { Pencil, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useRequestEmailChange } from '../../auth/hooks/use-change-email';
import { useAuthStore } from '@ielts/auth';
import { authApi } from '../../auth/services/auth.api';

// ============================================================================
// Types
// ============================================================================

interface SecuritySectionProps {
  readonly email: string;
}

// ============================================================================
// Component
// ============================================================================

export function SecuritySection({ email }: SecuritySectionProps) {
  const { toast } = useToast();
  const { requestEmailChange, isRequesting } = useRequestEmailChange();
  
  const user = useAuthStore((state) => state.user);
  const isEmailVerified = user?.isEmailVerified ?? false;

  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const handleResendVerification = async () => {
    if (!user) return;
    setIsSendingVerification(true);
    try {
      await authApi.sendVerification(user.email);
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox to verify your email address.',
      });
    } catch (err) {
      toast({
        title: 'Request failed',
        description: 'Failed to send verification email. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingVerification(false);
    }
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const isFormValid = !!currentPassword && !!newEmail;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) {
      toast({
        title: 'Missing fields',
        description:
          'Please enter both your current password and new email.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await requestEmailChange({ currentPassword, newEmail });
      toast({
        title: 'Verification email sent',
        description: `We've sent a verification link to ${newEmail}. Please verify it to complete the change.`,
      });
      setSubmittedEmail(newEmail);
      setCurrentPassword('');
      setNewEmail('');
      setIsFormOpen(false);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast({
        title: 'Request failed',
        description:
          error.response?.data?.message ||
          'Failed to request email change. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewEmail('');
    setIsFormOpen(false);
  };

  const handleResetVerification = () => {
    setSubmittedEmail(null);
    setIsFormOpen(false);
  };

  return (
    <section id="security" aria-labelledby="security-heading">
      <Card className="border-[var(--glass-border)]">
        <CardHeader>
          <CardTitle
            id="security-heading"
            className="text-base font-semibold text-foreground"
          >
            Security
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Manage your email address and account security.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Verification Success State */}
          {submittedEmail ? (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-1">
                  Verification sent
                </h3>
                <p className="text-sm text-muted-foreground">
                  We sent a link to{' '}
                  <strong className="text-foreground">{submittedEmail}</strong>.
                  Check your inbox and click the link to confirm. You&apos;ll be
                  logged out and can sign back in with your new email.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetVerification}
                className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 self-start"
              >
                Use a different email
              </button>
            </div>

          ) : (
            <>
              {/* Email Display Row */}
              <dl>
                <dt className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                  Email Address
                </dt>
                <dd className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{email}</span>
                    {isEmailVerified ? (
                      <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10 gap-1 rounded-full px-2 py-0 text-[10px] font-medium h-5">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/10 gap-1 rounded-full px-2 py-0 text-[10px] font-medium h-5">
                        <AlertCircle className="h-3 w-3" />
                        Unverified
                      </Badge>
                    )}
                  </div>

                  {!isEmailVerified && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isSendingVerification}
                      className="text-xs text-primary hover:underline transition-all sm:ml-2 disabled:opacity-50"
                    >
                      {isSendingVerification ? 'Sending...' : 'Resend Verification'}
                    </button>
                  )}

                  {!isFormOpen && (
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(true)}
                      aria-label="Change email address"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 shrink-0 sm:ml-auto"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                </dd>
              </dl>

              {/* Expandable Email Change Form */}
              {isFormOpen && (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 border-t border-border pt-5 animate-in fade-in duration-200"
                >
                  <header className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      Change Email Address
                    </h3>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                      aria-label="Close email change form"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </header>

                  <p className="text-xs text-muted-foreground -mt-2">
                    A verification link will be sent to the new email
                    address.
                  </p>

                  <fieldset className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="securityNewEmail"
                        className="text-sm font-medium text-muted-foreground"
                      >
                        New Email Address
                      </Label>
                      <Input
                        id="securityNewEmail"
                        type="email"
                        required
                        value={newEmail}
                        onChange={(event) => setNewEmail(event.target.value)}
                        placeholder="New email"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="securityCurrentPassword"
                        className="text-sm font-medium text-muted-foreground"
                      >
                        Current Password
                      </Label>
                      <PasswordInput
                        id="securityCurrentPassword"
                        required
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(event.target.value)
                        }
                        placeholder="Current password"
                        autoComplete="current-password"
                      />
                    </div>
                  </fieldset>

                  <footer className="flex flex-wrap items-center gap-2 justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isRequesting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isRequesting || !isFormValid}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isRequesting
                        ? 'Sending...'
                        : 'Send Verification'}
                    </Button>
                  </footer>
                </form>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
