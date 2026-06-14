import { Button, DialogTitle, Input, Label, PasswordInput, useToast } from '@ielts/ui';
import { ArrowLeft, Mail, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useRequestEmailChange } from '../../features/auth/hooks/use-change-email';
import type { AxiosError } from 'axios';

// ============================================================================
// Types
// ============================================================================

interface ChangeEmailViewProps {
  readonly onBack: () => void;
  readonly onSuccess: () => void;
}

interface ErrorPayload {
  message?: string;
}

// ============================================================================
// Component
// ============================================================================

export function ChangeEmailView({ onBack, onSuccess }: ChangeEmailViewProps) {
  const { toast } = useToast();
  const { requestEmailChange, isRequesting } = useRequestEmailChange();

  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const isFormValid = !!newEmail && !!currentPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    try {
      await requestEmailChange({ currentPassword, newEmail });
      toast({
        title: 'Email updated!',
        description: `We've sent a verification link to ${newEmail}.`,
      });
      onSuccess();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorPayload>;
      const errorMessage =
        axiosError.response?.data?.message || 'Please check your password and try again.';
      toast({
        title: 'Failed to update email',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {/* Header */}
      <header className="px-6 pt-6 pb-0 flex flex-col items-center gap-3">
        {/* Back button — top-left positioned */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          disabled={isRequesting}
          className="absolute left-3 top-3 h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Pencil className="h-5 w-5 text-primary" />
        </div>
        <div className="text-center">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            Change Email
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xs mx-auto">
            Enter your new email and confirm with your password. We'll send a verification link to
            the new address.
          </p>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 flex flex-col gap-4">
        <fieldset disabled={isRequesting} className="flex flex-col gap-3.5 border-none p-0 m-0">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="changeEmail" className="text-xs font-medium text-muted-foreground">
              New Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                id="changeEmail"
                type="email"
                required
                className="pl-9 h-10 text-sm"
                placeholder="new@example.com"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="changeEmailPassword" className="text-xs font-medium text-muted-foreground">
              Current Password
            </Label>
            <PasswordInput
              id="changeEmailPassword"
              required
              className="h-10 text-sm"
              placeholder="Enter your password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
        </fieldset>

        <Button
          type="submit"
          className="w-full font-semibold text-sm"
          size="lg"
          disabled={!isFormValid || isRequesting}
        >
          {isRequesting ? 'Updating…' : 'Update & Verify'}
        </Button>
      </form>
    </>
  );
}
