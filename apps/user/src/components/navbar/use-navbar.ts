import { useDisclosure, useToast } from '@chakra-ui/react';
import {
  axiosInstance,
  selectIsAuthenticated,
  useAuthStore,
} from '@ielts/auth';
import { useQuizStore } from '@ielts/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const accessToken = useAuthStore((state) => state.accessToken);
  const searchParams = useSearchParams();
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

  // Session restoration - only attempt if we have an access token
  const { data: restoredUser } = useQuery({
    queryKey: ['auth', 'restore'],
    queryFn: () => authApi.getMe({ skipErrorLogging: true }),
    enabled: hasHydrated && !isAuthenticated && !!accessToken,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (restoredUser && !isAuthenticated) {
      setUser(restoredUser);
    }
  }, [restoredUser, isAuthenticated, setUser]);

  useEffect(() => {
    // Check if we just logged out via redirection
    if (searchParams.get('logout') === 'success' && user) {
      logout();
      queryClient.clear();

      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 2000,
      });

      // Clear the query param
      router.replace('/');
    }
  }, [searchParams, user, logout, queryClient, toast, router]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      document.cookie = 'accessToken=; path=/; max-age=0';
      useQuizStore.getState().reset();
      router.push('/?logout=success');
      onClose();
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
