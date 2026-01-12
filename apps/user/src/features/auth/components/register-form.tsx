'use client';

import { Link as ChakraLink, FormControl, FormLabel, Text, VStack } from '@chakra-ui/react';
import { Button, Card, CardContent, CardHeader, Input } from '@ielts/ui';
import Link from 'next/link';
import { useState } from 'react';
import { useRegister } from '../hooks/use-register';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password });
  };

  return (
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
                placeholder="Min 6 characters"
              />
            </FormControl>

            <Button type="submit" width="100%" isLoading={registerMutation.isPending}>
              Sign Up
            </Button>

            <Text color="gray.400" textAlign="center">
              Already have an account?{' '}
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
