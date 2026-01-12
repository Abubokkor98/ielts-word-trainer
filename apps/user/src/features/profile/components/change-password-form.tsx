import { Button, FormControl, FormLabel, Heading, Input, useToast, VStack } from '@chakra-ui/react';
import { Card, CardContent, CardHeader } from '@ielts/ui';
import { useState } from 'react';
import type { ChangePasswordRequest } from '../types';

interface ChangePasswordFormProps {
  onChangePassword: (data: ChangePasswordRequest) => Promise<void>;
  isLoading: boolean;
}

export function ChangePasswordForm({ onChangePassword, isLoading }: ChangePasswordFormProps) {
  const toast = useToast();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast({ title: 'Passwords do not match', status: 'error' });
      return;
    }
    if (passwords.new.length < 6) {
      toast({ title: 'Password too short (min 6 chars)', status: 'error' });
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
        <Heading size="md" color="gray.50">
          Change Password
        </Heading>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="gray.300" fontSize="sm">
                Current Password
              </FormLabel>
              <Input
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    current: e.target.value,
                  })
                }
                placeholder="Enter current password"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.300" fontSize="sm">
                New Password
              </FormLabel>
              <Input
                type="password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    new: e.target.value,
                  })
                }
                placeholder="Enter new password"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.300" fontSize="sm">
                Confirm New Password
              </FormLabel>
              <Input
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirm: e.target.value,
                  })
                }
                placeholder="Confirm new password"
              />
            </FormControl>
            <Button type="submit" isLoading={isLoading} width="full">
              Update Password
            </Button>
          </VStack>
        </form>
      </CardContent>
    </Card>
  );
}
