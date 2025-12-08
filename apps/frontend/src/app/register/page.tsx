'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      if (data.success) {
        toast({
          title: 'Registration successful!',
          description: `Welcome, ${data.data.name}! Your account has been created.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data));
        router.push('/');
      }
    } catch (err: any) {
      toast({
        title: 'Registration failed',
        description: err.response?.data?.message || 'Unable to create account',
        status: 'error',
        duration: 5000,
        isClosable: true,
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
              Create Account
            </Text>
            <Text color="gray.400" fontSize="md">
              Start your IELTS vocabulary journey today
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
                  placeholder="••••••••"
                />
              </FormControl>

              <Button
                type="submit"
                width="100%"
                isLoading={loading}
                loadingText="Creating account..."
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
