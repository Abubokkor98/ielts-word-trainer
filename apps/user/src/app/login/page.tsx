'use client';

import { Suspense } from 'react';
import { Flex } from '@chakra-ui/react';
import { LoginForm } from '../../features/auth/components/login-form';

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
