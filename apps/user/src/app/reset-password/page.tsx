'use client';

import { Suspense } from 'react';
import { Flex } from '@chakra-ui/react';
import { ResetPasswordForm } from '../../features/auth/components/reset-password-form';

function ResetPasswordPageContent() {
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
      <ResetPasswordForm />
    </Flex>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
