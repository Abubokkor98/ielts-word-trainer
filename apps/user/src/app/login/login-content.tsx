'use client';

import { Flex } from '@chakra-ui/react';
import { LoginForm } from '../../features/auth/components/login-form';

export function LoginContent() {
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
