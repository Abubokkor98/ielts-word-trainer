'use client';

import {
  Box,
  Link as ChakraLink,
  FormControl,
  FormLabel,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import { Button, Card, CardContent, CardHeader, Input } from '@ielts/ui';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const toast = useToast();
  const { setUser, setToken } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(
        '/admin/login',
        {
          email,
          password,
        },
        { timeout: 10000 },
      );

      if (!data || !data.accessToken || !data.data || !data.data.role) {
        throw new Error('Invalid response structure from server');
      }

      return data;
    },
    onSuccess: (data) => {
      // Role validation: Only allow admin users
      if (!['admin', 'super_admin'].includes(data.data.role)) {
        toast({
          title: 'Access Denied',
          description: `Only administrators can access this portal. Regular users should use the User Portal at ${
            process.env.NEXT_PUBLIC_USER_APP_URL || 'http://localhost:3000'
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
      const isSecure = window.location.protocol === 'https:';
      document.cookie = `admin_auth_token=${
        data.accessToken
      }; path=/; max-age=900; SameSite=Strict${isSecure ? '; Secure' : ''}`;

      toast({
        title: 'Login successful!',
        description: `Welcome back, ${data.data.name}!`,
        status: 'success',
        duration: 3000,
      });

      router.push('/dashboard');
    },
    onError: (error: Error | { response?: { data?: { message?: string } } }) => {
      toast({
        title: 'Login failed',
        description:
          ('response' in error && error.response?.data?.message) || 'Invalid credentials',
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
              Admin Portal
            </Text>
            <Text color="gray.400" fontSize="md">
              Secure login for administrators only
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
                  placeholder="admin@email.com"
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
                <Box textAlign="right" mt={1}>
                  <ChakraLink
                    as={Link}
                    href="/forgot-password"
                    color="brand.400"
                    fontSize="sm"
                    fontWeight="500"
                  >
                    Forgot Password?
                  </ChakraLink>
                </Box>
              </FormControl>

              <Button type="submit" width="100%" isLoading={loginMutation.isPending}>
                Admin Login
              </Button>

              <Text color="gray.400" textAlign="center" fontSize="sm">
                <ChakraLink
                  as={Link}
                  href={process.env.NEXT_PUBLIC_USER_APP_URL || 'http://localhost:3000'}
                  color="brand.400"
                  fontWeight="600"
                >
                  Regular user? Go to User Portal
                </ChakraLink>
              </Text>
            </VStack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
