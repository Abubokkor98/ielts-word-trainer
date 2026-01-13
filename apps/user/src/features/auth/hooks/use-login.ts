import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '../services/auth.api';
import type { LoginCredentials } from '../types';

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setToken(data.accessToken);
      setUser(data.data);

      toast({
        title: 'Login successful!',
        description: `Welcome back, ${data.data.name}!`,
        status: 'success',
        duration: 3000,
      });

      // Get redirect URL from query params, default to home page
      const redirectTo = searchParams.get('redirect') || '/';

      // Security: Ensure redirect is a relative path (not external URL or protocol-relative)
      const safeRedirect =
        redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/';

      router.push(safeRedirect);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 5000,
      });
    },
  });
}
