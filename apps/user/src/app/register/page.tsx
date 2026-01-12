import { Metadata } from 'next';
import { Flex } from '@chakra-ui/react';
import { RegisterForm } from '../../features/auth/components/register-form';

export const metadata: Metadata = {
  title: 'Create Account - IELTS Vocabs',
  description: 'Start your journey to mastering IELTS vocabulary.',
};

export default function RegisterPage() {
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
      <RegisterForm />
    </Flex>
  );
}
