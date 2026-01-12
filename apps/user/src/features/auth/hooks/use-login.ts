import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { authApi } from '../services/auth.api';
import { LoginCredentials } from '../types';

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      // Role validation: Only allow regular users
      if (data.data.role === 'admin') {
        toast({
          title: 'Access Denied',
          description: `Admin accounts must use the Admin Portal at ${
            process.env.NEXT_PUBLIC_ADMIN_APP_URL || 'the admin portal'
          }`,
          status: 'warning',
          duration: 6000,
          isClosable: true,
        });
        return;
      }

      setToken(data.accessToken);
      setUser(data.data);

      // Set cookie for middleware
      const isSecure = window.location.protocol === 'https:';
      document.cookie = `user_auth_token=${
        data.accessToken
      }; path=/; max-age=900; SameSite=Strict${isSecure ? '; Secure' : ''}`;

      toast({
        title: 'Login successful!',
        description: `Welcome back, ${data.data.name}!`,
        status: 'success',
        duration: 3000,
      });

      // Get redirect URL from query params, default to home page
      const redirectTo = searchParams.get('redirect') || '/';

      // Security: Ensure redirect is a relative path (not external URL)
      const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/';

      router.push(safeRedirect);
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 5000,
      });
    },
  });
}
