import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/auth.api';
import { useAuthStore } from '@ielts/auth';

export function useVerifyEmail() {
  const { user, setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      if (user) {
        setUser({ ...user, isEmailVerified: true });
      }
    },
  });

  return {
    verifyEmail: mutation.mutate,
    isVerifying: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
