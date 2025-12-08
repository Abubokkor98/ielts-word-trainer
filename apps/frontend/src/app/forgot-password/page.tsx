'use client';

import { useState } from 'react';
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/password/request-reset', { email });

      if (data.success) {
        setEmailSent(true);
        toast({
          title: 'Email sent!',
          description: "We've sent a password reset link to your email.",
          status: 'success',
          duration: 5000,
          position: 'top',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Request failed',
        description:
          err.response?.data?.message || 'Unable to send reset email',
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
              {emailSent ? 'Check Your Email' : 'Forgot Password?'}
            </Text>
            <Text color="gray.400" fontSize="md">
              {emailSent
                ? "We've sent you a password reset link"
                : 'Enter your email to receive a reset link'}
            </Text>
          </VStack>
        </CardHeader>
        <CardContent>
          {!emailSent ? (
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel fontWeight="bold" color="gray.300">
                    Email Address
                  </FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </FormControl>

                <Button
                  type="submit"
                  width="100%"
                  isLoading={loading}
                  loadingText="Sending..."
                >
                  Send Reset Link
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
          ) : (
            <VStack spacing={6} align="stretch">
              <Box
                p={4}
                bg="green.900"
                borderRadius="md"
                borderWidth="1px"
                borderColor="green.700"
              >
                <Text color="green.200" fontSize="sm">
                  ✅ We've sent a password reset link to{' '}
                  <strong>{email}</strong>. Please check your inbox and follow
                  the instructions.
                </Text>
              </Box>

              <Text color="gray.400" fontSize="sm" textAlign="center">
                Didn't receive the email? Check your spam folder or{' '}
                <ChakraLink
                  color="brand.400"
                  fontWeight="bold"
                  cursor="pointer"
                  onClick={() => setEmailSent(false)}
                  _hover={{ color: 'brand.500', textDecoration: 'underline' }}
                >
                  try again
                </ChakraLink>
              </Text>

              <Text color="gray.400" textAlign="center">
                <ChakraLink
                  as={Link}
                  href="/login"
                  color="brand.400"
                  fontWeight="bold"
                  _hover={{ color: 'brand.500', textDecoration: 'underline' }}
                >
                  Back to Login
                </ChakraLink>
              </Text>
            </VStack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
