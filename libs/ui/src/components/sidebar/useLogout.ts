'use client';

import { useToast } from '../../hooks/use-toast';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const { logout: clearAuth } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Logout function
  const logout = async () => {
    try {
      await axiosInstance.post('/admin/logout');

      // Clear auth state first (before showing toast)
      clearAuth();
      queryClient.clear();

      // Show success toast
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of the admin panel.',
      });

      // Navigate to home
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error ?? 'Failed to logout. Please try again.'
        : 'Failed to logout. Please try again.';

      toast({
        title: 'Logout failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return { logout };
};
