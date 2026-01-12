import { Metadata } from 'next';
import { Suspense } from 'react';
import { Flex } from '@chakra-ui/react';
import { LoginForm } from '../../features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Login - IELTS Vocabs',
  description: 'Access your vocabulary learning dashboard.',
};

function LoginPageContent() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      flex="1"
      bg="gray.900"
      px={4}
      py={12}
    >
      <LoginForm />
    </Flex>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
