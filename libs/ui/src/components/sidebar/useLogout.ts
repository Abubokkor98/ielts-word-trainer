'use client';

import { useToast } from '@chakra-ui/react';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const { logout: clearAuth } = useAuthStore();
  const toast = useToast();
  const router = useRouter();

  // Logout function
  const logout = async () => {
    try {
      await axiosInstance.post('/admin/logout');

      // Show success toast
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      // Clear auth state and navigate
      clearAuth();
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error ?? 'Failed to logout. Please try again.'
        : 'Failed to logout. Please try again.';

      toast({
        title: 'Logout failed',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return { logout };
};
