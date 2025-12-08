'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { useAuthStore } from '../../store/auth.store';
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
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
      setToken(data.accessToken);
      setUser(data.data);

      toast({
        title: 'Login successful!',
        description: `Welcome back, ${data.data.name}!`,
        status: 'success',
        duration: 3000,
      });

      router.push('/dashboard');
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
    </Box>
  );
}
