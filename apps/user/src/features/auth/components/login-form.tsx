'use client';
import { Link as ChakraLink, FormControl, FormLabel, Text, VStack } from '@chakra-ui/react';
import { Button, Card, CardContent, CardHeader, Input } from '@ielts/ui';
import Link from 'next/link';
import { useState } from 'react';
import { useLogin } from '../hooks/use-login';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
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

            <Button type="submit" width="100%" isLoading={loginMutation.isPending}>
              Login
            </Button>

            <Text color="gray.400" textAlign="center" fontSize="sm">
              <ChakraLink as={Link} href="/forgot-password" color="brand.400" fontWeight="600">
                Forgot password?
              </ChakraLink>
            </Text>

            <Text color="gray.400" textAlign="center">
              Don't have an account?{' '}
              <ChakraLink as={Link} href="/register" color="brand.400" fontWeight="bold">
                Sign up
              </ChakraLink>
            </Text>
          </VStack>
        </form>
      </CardContent>
    </Card>
  );
}
