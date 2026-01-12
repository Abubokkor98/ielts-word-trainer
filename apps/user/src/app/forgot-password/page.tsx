'use client';

import { Flex } from '@chakra-ui/react';
import { ForgotPasswordForm } from '../../features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
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
      <ForgotPasswordForm />
    </Flex>
  );
}
