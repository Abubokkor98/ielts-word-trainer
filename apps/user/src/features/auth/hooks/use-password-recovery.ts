import { useToast } from '@ielts/ui';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { authApi } from '../services/auth.api';
import type { ForgotPasswordCredentials, ResetPasswordCredentials } from '../types';

export function usePasswordRecovery() {
  const router = useRouter();
  const { toast } = useToast();

  const forgotPasswordMutation = useMutation({
    mutationFn: (credentials: ForgotPasswordCredentials) => authApi.forgotPassword(credentials),
    onSuccess: () => {
      toast({
        title: 'Check your email',
        description: 'We have sent you a password reset link.',
      });
    },
    onError: (error: AxiosError<{ message: string; error?: string }>) => {
      // Handle Rate Limit (429) specifically if needed, or generic error structure
      const errorMessage =
        error.response?.status === 429
          ? 'Too many attempts. Please try again in an hour.'
          : error.response?.data?.message || error.response?.data?.error || 'Something went wrong';

      toast({
        title: error.response?.status === 429 ? 'Rate Limit Exceeded' : 'Request failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (credentials: ResetPasswordCredentials) => authApi.resetPassword(credentials),
    onSuccess: () => {
      toast({
        title: 'Password reset successful',
        description: 'You can now login with your new password.',
      });
      router.push('/login');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: 'Reset failed',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
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
