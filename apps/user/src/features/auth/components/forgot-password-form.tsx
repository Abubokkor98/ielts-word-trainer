import { useState } from 'react';
import Link from 'next/link';
import {
  Text,
  VStack,
  FormControl,
  FormLabel,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Button, Input, Card, CardHeader, CardContent } from '@ielts/ui';
import { usePasswordRecovery } from '../hooks/use-password-recovery';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const { forgotPassword, isForgotPasswordPending } = usePasswordRecovery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword({ email });
  };

  return (
    <Card maxW="md" w="full" p={8}>
      <CardHeader>
        <VStack spacing={2} textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color="gray.50">
            Forgot Password?
          </Text>
          <Text color="gray.400" fontSize="md">
            Enter your email to receive a reset link
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
              isLoading={isForgotPasswordPending}
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
              >
                Login
              </ChakraLink>
            </Text>
          </VStack>
        </form>
      </CardContent>
    </Card>
  );
}
