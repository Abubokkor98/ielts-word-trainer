'use client';

import { Box, FormControl, FormLabel, Text, useToast, VStack } from '@chakra-ui/react';
import { axiosInstance } from '@ielts/auth';
import { Button, Card, CardContent, CardHeader, Input } from '@ielts/ui';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ResetPasswordFormProps {
  redirectPath?: string;
  title?: string;
  description?: string;
  apiPrefix?: string;
}

export function ResetPasswordForm({
  redirectPath = '/login',
  title = 'Reset Password',
  description = 'Enter your new password',
  apiPrefix = '/password',
}: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast({
        title: 'Invalid reset link',
        description: 'Please request a new password reset',
        status: 'error',
      });
      router.push('/forgot-password');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, router, toast]);

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const { data } = await axiosInstance.post(`${apiPrefix}/reset-password`, {
        token,
        password,
      });
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Password reset successful!',
        description: 'You can now login with your new password.',
        status: 'success',
        duration: 3000,
      });
      setTimeout(() => router.push(redirectPath), 2000);
    },
    onError: (error: any) => {
      toast({
        title: 'Reset failed',
        description: error.response?.data?.message || 'Invalid or expired token',
        status: 'error',
        duration: 5000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({ title: 'Password too short (min 6 chars)', status: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', status: 'error' });
      return;
    }

    resetPasswordMutation.mutate({ token, password: newPassword });
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.900"
      py={12}
      px={4}
    >
      <Card maxW="md" w="full" p={8}>
        <CardHeader>
          <VStack spacing={2} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="gray.50">
              {title}
            </Text>
            <Text color="gray.400" fontSize="md">
              {description}
            </Text>
          </VStack>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.300">
                  New Password
                </FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.300">
                  Confirm Password
                </FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </FormControl>

              <Button type="submit" width="100%" isLoading={resetPasswordMutation.isPending}>
                Reset Password
              </Button>
            </VStack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
