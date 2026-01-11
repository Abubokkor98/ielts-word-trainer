'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const forgotPasswordMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post('/password/request-reset', {
        email,
      });
      return data;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: 'Email sent!',
        description: 'Check your inbox for reset instructions.',
        status: 'success',
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send email',
        description: error.response?.data?.message || 'Please try again',
        status: 'error',
        duration: 5000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate();
  };

  if (submitted) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        flex="1"
        bg="gray.900"
        py={12}
        px={4}
      >
        <Card maxW="md" w="full" p={8}>
          <CardContent>
            <VStack spacing={4}>
              <Text fontSize="3xl">✅</Text>
              <Text fontSize="2xl" fontWeight="bold" color="gray.50">
                Check Your Email
              </Text>
              <Text color="gray.400" textAlign="center">
                We've sent password reset instructions to {email}
              </Text>
              <ChakraLink
                as={Link}
                href="/login"
                color="brand.400"
                fontWeight="bold"
              >
                Return to login
              </ChakraLink>
            </VStack>
          </CardContent>
        </Card>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      flex="1"
      bg="gray.900"
      py={12}
      px={4}
    >
      <Card maxW="md" w="full" p={8}>
        <CardHeader>
          <VStack spacing={2} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="gray.50">
              Forgot Password?
            </Text>
            <Text color="gray.400" fontSize="md">
              Enter your email to reset your password
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

              <Button
                type="submit"
                width="100%"
                isLoading={forgotPasswordMutation.isPending}
              >
                Send Reset Link
              </Button>

              <ChakraLink
                as={Link}
                href="/login"
                color="brand.400"
                fontWeight="bold"
              >
                Back to login
              </ChakraLink>
            </VStack>
          </form>
        </CardContent>
      </Card>
    </Flex>
  );
}
