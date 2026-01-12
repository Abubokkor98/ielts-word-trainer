import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../services/analytics.api';

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'me'],
    queryFn: analyticsApi.getAnalytics,
  });
}
