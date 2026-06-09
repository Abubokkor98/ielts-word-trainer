import {
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
import { useState } from 'react';
import { useRequestEmailChange } from '../../auth/hooks/use-change-email';
import type { AxiosError } from 'axios';
import { Mail } from 'lucide-react';

export function ChangeEmailForm() {
  const { toast } = useToast();
  const { requestEmailChange, isRequesting } = useRequestEmailChange();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !currentPassword) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both your current password and new email.',
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
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast({
        title: 'Request failed',
        description:
          error.response?.data?.message || 'Failed to request email change. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isFormValid = !!currentPassword && !!newEmail;

  if (submittedEmail) {
    return (
      <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Verification Sent!
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                A confirmation link was sent.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-foreground">
            We've sent a verification link to <strong className="text-primary">{submittedEmail}</strong>.
            Please check your inbox and click the link to confirm your email change.
          </p>
          <div className="rounded-lg bg-muted p-4 border border-border text-xs text-muted-foreground flex flex-col gap-1.5">
            <span className="font-semibold text-foreground">Next steps:</span>
            <span>1. Open your new email inbox and find the verification email.</span>
            <span>2. Click the link to verify the new email address.</span>
            <span>3. You will be logged out globally and can sign back in with your new email.</span>
          </div>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => setSubmittedEmail(null)}
          >
            Change a different email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Change Email Address
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Update the email address associated with your account. A verification link will be sent to
          the new email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="changeEmailNewEmail"
                className="text-sm font-medium text-muted-foreground"
              >
                New Email Address
              </Label>
              <Input
                id="changeEmailNewEmail"
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="changeEmailPassword"
                className="text-sm font-medium text-muted-foreground"
              >
                Current Password
              </Label>
              <PasswordInput
                id="changeEmailPassword"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              disabled={isRequesting || !isFormValid}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
            >
              {isRequesting ? 'Sending Verification...' : 'Send Verification Email'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
