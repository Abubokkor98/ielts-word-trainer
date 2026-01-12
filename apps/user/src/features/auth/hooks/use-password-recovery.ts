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
        title: 'Check your email',
        description: 'We have sent you a password reset link.',
        status: 'success',
        duration: 5000,
      });
    },
    onError: (error: any) => {
      // Handle Rate Limit (429) specifically if needed, or generic error structure
      const errorMessage =
        error.response?.status === 429
          ? 'Too many attempts. Please try again in an hour.'
          : error.response?.data?.message ||
            error.response?.data?.error ||
            'Something went wrong';

      toast({
        title:
          error.response?.status === 429
            ? 'Rate Limit Exceeded'
            : 'Request failed',
        description: errorMessage,
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
    isForgotPasswordSuccess: forgotPasswordMutation.isSuccess,
    resetPassword: resetPasswordMutation.mutate,
    isResetPasswordPending: resetPasswordMutation.isPending,
  };
}
