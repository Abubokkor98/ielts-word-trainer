'use client';

import { useToast } from '@chakra-ui/react';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import axios from 'axios';

export const useLogout = () => {
  const { logout: clearAuth } = useAuthStore();
  const toast = useToast();

  // Logout function
  const logout = async () => {
    try {
      await axiosInstance.post('/admin/logout');

      // Clear auth state
      clearAuth();

      // Show success toast
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      // Redirect to login
      window.location.replace('/');
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
