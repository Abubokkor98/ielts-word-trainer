'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@chakra-ui/react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const toast = useToast();
  const { setUser, setToken } = useAuthStore();

  const registerMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
      });
      return data;
    },
    onSuccess: (data) => {
      setToken(data.accessToken);
      setUser(data.data);

      // Set cookie for middleware
      document.cookie = `user_auth_token=${data.accessToken}; path=/; max-age=86400; SameSite=Strict`;

      toast({
        title: 'Registration successful!',
        description: 'Your account has been created.',
        status: 'success',
        duration: 3000,
      });

      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description:
          error.response?.data?.message || 'Unable to create account',
        status: 'error',
        duration: 5000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate();
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
              Create Account
            </Text>
            <Text color="gray.400" fontSize="md">
              Start your IELTS vocabulary journey
            </Text>
          </VStack>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.300">
                  Name
                </FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </FormControl>

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
                  placeholder="Min  6 characters"
                />
              </FormControl>

              <Button
                type="submit"
                width="100%"
                isLoading={registerMutation.isPending}
              >
                Sign Up
              </Button>

              <Text color="gray.400" textAlign="center">
                Already have an account?{' '}
                <ChakraLink
                  as={Link}
                  href="/login"
                  color="brand.400"
                  fontWeight="bold"
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
