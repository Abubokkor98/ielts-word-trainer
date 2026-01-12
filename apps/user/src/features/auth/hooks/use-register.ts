import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { authApi } from '../services/auth.api';
import { RegisterCredentials } from '../types';

export function useRegister() {
  const router = useRouter();
  const toast = useToast();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authApi.register(credentials),
    onSuccess: (data) => {
      setToken(data.accessToken);
      setUser(data.data);

      // Set cookie for middleware
      const isSecure = window.location.protocol === 'https:';
      document.cookie = `user_auth_token=${
        data.accessToken
      }; path=/; max-age=900; SameSite=Strict${isSecure ? '; Secure' : ''}`;

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
