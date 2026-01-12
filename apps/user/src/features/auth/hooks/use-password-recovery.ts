import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { authApi } from '../services/auth.api';
import { ForgotPasswordCredentials, ResetPasswordCredentials } from '../types';

export function usePasswordRecovery() {
  const router = useRouter();
  const toast = useToast();

  const forgotPasswordMutation = useMutation({
    mutationFn: (credentials: ForgotPasswordCredentials) =>
      authApi.forgotPassword(credentials),
    onSuccess: () => {
      toast({
        title: 'Email sent',
        description: 'If an account exists, you will receive a reset link.',
        status: 'success',
        duration: 5000,
      });
      router.push('/login');
    },
    onError: (error: any) => {
      toast({
        title: 'Request failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (credentials: ResetPasswordCredentials) =>
      authApi.resetPassword(credentials),
    onSuccess: () => {
      toast({
        title: 'Password reset successful',
        description: 'You can now login with your new password.',
        status: 'success',
        duration: 5000,
      });
      router.push('/login');
    },
    onError: (error: any) => {
      toast({
        title: 'Reset failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    },
  });

  return {
    forgotPassword: forgotPasswordMutation.mutate,
    isForgotPasswordPending: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    isResetPasswordPending: resetPasswordMutation.isPending,
  };
}
