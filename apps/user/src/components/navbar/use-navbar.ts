import { useDisclosure, useToast } from '@chakra-ui/react';
import {
  axiosInstance,
  selectIsAuthenticated,
  useAuthStore,
} from '@ielts/auth';
import { useQuizStore } from '@ielts/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authApi } from '../../features/auth/services/auth.api';

interface SrsStats {
  totalWords: number;
  learning: number;
  reviewing: number;
  mastered: number;
  dueToday: number;
  newToday: number;
}

export function useNavbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Session restoration - attempt on initial load if no user (might have cookies)
  const { data: restoredUser } = useQuery({
    queryKey: ['auth', 'restore'],
    queryFn: () => authApi.getMe({ skipErrorLogging: true }),
    enabled: hasHydrated && !user, // ✅ Changed: attempt if no user (might have cookies)
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    // Only restore if we got a user AND currently have no user
    if (restoredUser && !user) {
      setUser(restoredUser);
    }
    // If restoration failed with auth error, cookies are truly invalid
    // Don't do anything - let interceptor handle it on next API call
    // Don't clear user on network errors
  }, [restoredUser, user, setUser]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');

      logout();
      queryClient.clear();
      useQuizStore.getState().reset();
      document.cookie = 'accessToken=; path=/; max-age=0';
      document.cookie = 'refreshToken=; path=/; max-age=0';

      // Show success toast immediately (before redirect)
      // Note: The useEffect won't trigger because we already cleared the user state
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 2000,
      });

      // Redirect and close modal
      router.push('/');
      onClose();
    } catch (error: unknown) {
      console.error('Logout failed:', error);

      const errorMessage =
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'error' in error.response.data
          ? String(error.response.data.error)
          : 'Failed to logout. Please try again.';

      toast({
        title: 'Logout failed',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });

      // Don't clear state - user stays logged in
      onClose(); // Just close the modal
    }
  };

  const { data: srsStats } = useQuery<SrsStats>({
    queryKey: ['srs', 'stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/srs/stats');
      return data.data;
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const dueCount = srsStats?.dueToday || 0;

  return {
    isOpen,
    onOpen,
    onClose,
    isAuthenticated,
    user,
    handleLogout,
    dueCount,
    isScrolled,
  };
}
