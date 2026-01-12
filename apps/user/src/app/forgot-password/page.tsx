import { Metadata } from 'next';
import { Flex } from '@chakra-ui/react';
import { ForgotPasswordForm } from '../../features/auth/components/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password - IELTS Vocabs',
  description: 'Recover access to your account.',
};

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
