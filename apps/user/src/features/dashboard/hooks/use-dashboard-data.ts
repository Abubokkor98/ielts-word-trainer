import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboard.api';

export function useDashboardData(isAuthenticated: boolean, localUser: any) {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: dashboardApi.getUser,
    enabled: !!localUser && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics', 'me'],
    queryFn: dashboardApi.getAnalytics,
    enabled: !!localUser && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: srsStats, isLoading: srsLoading } = useQuery({
    queryKey: ['srs', 'stats'],
    queryFn: dashboardApi.getSRSStats,
    enabled: !!localUser && isAuthenticated,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    user,
    analytics,
    srsStats,
    isLoading: userLoading || analyticsLoading || srsLoading,
  };
}
