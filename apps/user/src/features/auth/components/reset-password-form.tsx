'use client';

import {
  Link as ChakraLink,
  FormControl,
  FormLabel,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Button, Card, CardContent, CardHeader, Input } from '@ielts/ui';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { usePasswordRecovery } from '../hooks/use-password-recovery';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const searchParams = useSearchParams();
  const toast = useToast();
  const token = searchParams.get('token') || '';

  const { resetPassword, isResetPasswordPending } = usePasswordRecovery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    resetPassword({ token, password });
  };

  if (!token) {
    return (
      <Card maxW="md" w="full" p={8}>
        <CardContent>
          <VStack spacing={4} textAlign="center">
            <Text color="red.400">Invalid or missing reset token.</Text>
            <ChakraLink as={Link} href="/login" color="brand.400">
              Back to Login
            </ChakraLink>
          </VStack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card maxW="md" w="full" p={8}>
      <CardHeader>
        <VStack spacing={2} textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color="gray.50">
            Reset Password
          </Text>
          <Text color="gray.400" fontSize="md">
            Enter your new password below
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                placeholder="Confirm password"
              />
            </FormControl>

            <Button type="submit" width="100%" isLoading={isResetPasswordPending}>
              Reset Password
            </Button>

            <Text color="gray.400" textAlign="center">
              Remember your password?{' '}
              <ChakraLink as={Link} href="/login" color="brand.400" fontWeight="bold">
                Login
              </ChakraLink>
            </Text>
          </VStack>
        </form>
      </CardContent>
    </Card>
  );
}
