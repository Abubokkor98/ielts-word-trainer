'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
import { useAuthStore } from '@ielts/auth';
import { Button, Input, Card, CardHeader, CardContent } from '@ielts/ui';
import {
  Box,
  Text,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  Link as ChakraLink,
  Flex,
} from '@chakra-ui/react';
import Link from 'next/link';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { setUser, setToken } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      return data;
    },
    onSuccess: (data) => {
      // Role validation: Only allow regular users
      if (data.data.role === 'admin') {
        toast({
          title: 'Access Denied',
          description: `Admin accounts must use the Admin Portal at ${
            process.env.NEXT_PUBLIC_ADMIN_APP_URL || 'the admin portal'
          }`,
          status: 'warning',
          duration: 6000,
          isClosable: true,
        });
        return;
      }

      setToken(data.accessToken);
      setUser(data.data);

      // Set cookie for middleware
      document.cookie = `user_auth_token=${data.accessToken}; path=/; max-age=86400; SameSite=Strict`;

      toast({
        title: 'Login successful!',
        description: `Welcome back, ${data.data.name}!`,
        status: 'success',
        duration: 3000,
      });

      // Get redirect URL from query params, default to home page
      const redirectTo = searchParams.get('redirect') || '/';

      // Security: Ensure redirect is a relative path (not external URL)
      const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/';

      router.push(safeRedirect);
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 5000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      flex="1"
      bg="gray.900"
      px={4}
      py={12}
    >
      <Card maxW="md" w="full" p={8}>
        <CardHeader>
          <VStack spacing={2} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="gray.50">
              Welcome Back!
            </Text>
            <Text color="gray.400" fontSize="md">
              Login to continue your learning journey
            </Text>
          </VStack>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.300">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.300">
                  Password
                </FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </FormControl>

              <Button
                type="submit"
                width="100%"
                isLoading={loginMutation.isPending}
              >
                Login
              </Button>

              <Text color="gray.400" textAlign="center" fontSize="sm">
                <ChakraLink
                  as={Link}
                  href="/forgot-password"
                  color="brand.400"
                  fontWeight="600"
                >
                  Forgot password?
                </ChakraLink>
              </Text>

              <Text color="gray.400" textAlign="center">
                Don't have an account?{' '}
                <ChakraLink
                  as={Link}
                  href="/register"
                  color="brand.400"
                  fontWeight="bold"
                >
                  Sign up
                </ChakraLink>
              </Text>
            </VStack>
          </form>
        </CardContent>
      </Card>
    </Flex>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
