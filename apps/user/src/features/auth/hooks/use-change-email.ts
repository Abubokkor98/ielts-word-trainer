import { useAuthStore } from '@ielts/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/auth.api';
import type { ChangeEmailCredentials } from '../types';

export function useRequestEmailChange() {
  const mutation = useMutation({
    mutationFn: (credentials: ChangeEmailCredentials) => authApi.requestEmailChange(credentials),
  });

  return {
    requestEmailChange: mutation.mutateAsync,
    isRequesting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}

export function useVerifyEmailChange() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmailChange(token),
    onSuccess: () => {
      // Clear client session state as backend invalidated the sessions
      logout();
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    verifyEmailChange: mutation.mutateAsync,
    isVerifying: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
