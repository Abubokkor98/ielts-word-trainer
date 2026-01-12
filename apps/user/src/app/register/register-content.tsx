'use client';

import { Flex } from '@chakra-ui/react';
import { RegisterForm } from '../../features/auth/components/register-form';

export function RegisterContent() {
  return (
    <Flex direction="column" align="center" justify="center" flex="1" bg="gray.900" px={4} py={12}>
      <RegisterForm />
    </Flex>
  );
}
