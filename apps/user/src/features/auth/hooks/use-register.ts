import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../services/auth.api';
import type { RegisterCredentials } from '../types';

export function useRegister() {
  const router = useRouter();
  const toast = useToast();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: (data) => {
      setToken(data.accessToken);
      setUser(data.data);

      toast({
        title: 'Registration successful!',
        description: 'Welcome to IELTS Word Trainer!',
        status: 'success',
        duration: 3000,
      });

      router.push('/vocabulary');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    },
  });
}
