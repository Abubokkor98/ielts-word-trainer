import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, PasswordInput, useToast } from '@ielts/ui';
import { useState } from 'react';
import type { ChangePasswordRequest } from '../types';

interface ChangePasswordFormProps {
  onChangePassword: (data: ChangePasswordRequest) => Promise<void>;
  isLoading: boolean;
}

export function ChangePasswordForm({ onChangePassword, isLoading }: ChangePasswordFormProps) {
  const { toast } = useToast();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    if (passwords.new.length < 6) {
      toast({
        title: 'Password too short (min 6 chars)',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onChangePassword(passwords);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (_error) {
      // Error handled by hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium text-muted-foreground">
                Current Password
              </Label>
              <PasswordInput
                id="currentPassword"
                required
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    current: e.target.value,
                  })
                }
                placeholder="Enter current password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-muted-foreground">
                New Password
              </Label>
              <PasswordInput
                id="newPassword"
                required
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    new: e.target.value,
                  })
                }
                placeholder="Enter new password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-muted-foreground">
                Confirm New Password
              </Label>
              <PasswordInput
                id="confirmPassword"
                required
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirm: e.target.value,
                  })
                }
                placeholder="Confirm new password"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !passwords.current || !passwords.new || !passwords.confirm}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
