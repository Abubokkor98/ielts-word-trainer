'use client';

import Link from 'next/link';
import { Text, VStack, Link as ChakraLink } from '@chakra-ui/react';
import { Button, Card, CardHeader, CardContent } from '@ielts/ui';

interface ForgotPasswordSuccessUIProps {
  email: string;
}

export function ForgotPasswordSuccessUI({
  email,
}: ForgotPasswordSuccessUIProps) {
  return (
    <Card maxW="md" w="full" p={8}>
      <CardHeader>
        <VStack spacing={2} textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color="brand.400">
            Check your email
          </Text>
          <Text color="gray.400" fontSize="md">
            We have sent a password reset link to <br />
            <Text as="span" fontWeight="bold" color="white">
              {email}
            </Text>
          </Text>
        </VStack>
      </CardHeader>
      <CardContent>
        <VStack spacing={6}>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Did not receive the email? Check your spam folder or try another
            email address.
          </Text>
          <Button
            variant="outline"
            width="100%"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
          <Text color="gray.400" textAlign="center">
            Remember your password?{' '}
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
      </CardContent>
    </Card>
  );
}
