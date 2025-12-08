'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../lib/api';
import { Button, Input, Card, CardHeader, CardContent } from '@ielts/ui';
import {
  Box,
  Text,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  Link as ChakraLink,
} from '@chakra-ui/react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    // Get token from URL query parameter
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: 'Invalid link',
        description:
          'Reset token is missing. Please use the link from your email.',
        status: 'error',
        duration: 5000,
        position: 'top',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        status: 'error',
        duration: 5000,
        position: 'top',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        status: 'error',
        duration: 5000,
        position: 'top',
      });
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/password/reset-password', {
        token,
        password,
      });

      if (data.success) {
        toast({
          title: 'Password reset successful!',
          description:
            'Your password has been changed. You can now login with your new password.',
          status: 'success',
          duration: 5000,
          position: 'top',
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      toast({
        title: 'Reset failed',
        description:
          err.response?.data?.message ||
          'Unable to reset password. The link may have expired.',
        status: 'error',
        duration: 5000,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
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
              Reset Password
            </Text>
            <Text color="gray.400" fontSize="md">
              Enter your new password below
            </Text>
          </VStack>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.300">
                  New Password
                </FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
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

              {!token && (
                <Box
                  p={4}
                  bg="red.900"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="red.700"
                >
                  <Text color="red.200" fontSize="sm">
                    ⚠️ No reset token found. Please use the link from your
                    email.
                  </Text>
                </Box>
              )}

              <Button
                type="submit"
                width="100%"
                isLoading={loading}
                loadingText="Resetting..."
                isDisabled={!token}
              >
                Reset Password
              </Button>

              <Text color="gray.400" textAlign="center">
                Remember your password?{' '}
                <ChakraLink
                  as={Link}
                  href="/login"
                  color="brand.400"
                  fontWeight="bold"
                  _hover={{ color: 'brand.500', textDecoration: 'underline' }}
                >
                  Login
                </ChakraLink>
              </Text>
            </VStack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
