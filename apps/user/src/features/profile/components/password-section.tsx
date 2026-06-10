'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  PasswordInput,
  useToast,
} from '@ielts/ui';
import { Pencil, X } from 'lucide-react';
import { useState } from 'react';
import type { ChangePasswordRequest } from '../types';

// ============================================================================
// Constants
// ============================================================================

const MIN_PASSWORD_LENGTH = 6;

// ============================================================================
// Types
// ============================================================================

interface PasswordSectionProps {
  readonly onChangePassword: (data: ChangePasswordRequest) => Promise<void>;
  readonly isLoading: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function PasswordSection({
  onChangePassword,
  isLoading,
}: PasswordSectionProps) {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const isFormValid =
    !!passwords.current && !!passwords.new && !!passwords.confirm;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (passwords.new !== passwords.confirm) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwords.new.length < MIN_PASSWORD_LENGTH) {
      toast({
        title: `Password too short (min ${MIN_PASSWORD_LENGTH} chars)`,
        variant: 'destructive',
      });
      return;
    }

    try {
      await onChangePassword(passwords);
      setPasswords({ current: '', new: '', confirm: '' });
      setIsFormOpen(false);
    } catch (_error) {
      // Error handled by the hook
    }
  };

  const handleCancel = () => {
    setPasswords({ current: '', new: '', confirm: '' });
    setIsFormOpen(false);
  };

  const updateField = (field: keyof typeof passwords, value: string) => {
    setPasswords((previous) => ({ ...previous, [field]: value }));
  };

  return (
    <section id="password" aria-labelledby="password-heading">
      <Card className="border-[var(--glass-border)]">
        <CardHeader>
          <CardTitle
            id="password-heading"
            className="text-base font-semibold text-foreground"
          >
            Password
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Keep your account secure with a strong password.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Password Display Row */}
          <dl>
            <dt className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
              Password
            </dt>
            <dd className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="tracking-widest text-muted-foreground">••••••••••</span>
              {!isFormOpen && (
                <button
                  type="button"
                  onClick={() => setIsFormOpen(true)}
                  aria-label="Change password"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 shrink-0"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </dd>
          </dl>

          {/* Expandable Password Change Form */}
          {isFormOpen && (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 border-t border-border pt-5 animate-in fade-in duration-200"
            >
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Change Password
                </h3>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label="Close password change form"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              <fieldset className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="passwordCurrent"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Current Password
                  </Label>
                  <PasswordInput
                    id="passwordCurrent"
                    required
                    value={passwords.current}
                    onChange={(event) =>
                      updateField('current', event.target.value)
                    }
                    placeholder="Current password"
                    autoComplete="current-password"
                    autoFocus
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="passwordNew"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    New Password
                  </Label>
                  <PasswordInput
                    id="passwordNew"
                    required
                    value={passwords.new}
                    onChange={(event) =>
                      updateField('new', event.target.value)
                    }
                    placeholder="New password"
                    autoComplete="new-password"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="passwordConfirm"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Confirm Password
                  </Label>
                  <PasswordInput
                    id="passwordConfirm"
                    required
                    value={passwords.confirm}
                    onChange={(event) =>
                      updateField('confirm', event.target.value)
                    }
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />
                </div>
              </fieldset>

              <footer className="flex flex-wrap items-center gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !isFormValid}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </footer>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
