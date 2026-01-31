import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/users.api';
import type { UsersQueryParams, UsersResponse } from '../types';

export function useUsers(params: UsersQueryParams) {
  const { user } = useAuthStore();

  return useQuery<UsersResponse, Error>({
    queryKey: ['admin', 'users', params.page, params.limit, params.search],
    queryFn: () => usersApi.getUsers(params),
    enabled: !!user && ['admin', 'super_admin', 'viewer'].includes(user.role),
  });
}

export function useUserManagement() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: 'active' | 'banned';
    }) => usersApi.updateUserStatus(userId, status),
    onSuccess: (_, variables) => {
      toast({
        title: `User ${variables.status === 'banned' ? 'banned' : 'activated'}`,
        status: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to update user status';
      const isForbidden = error?.response?.status === 403;

      toast({
        title: isForbidden ? 'Action Not Allowed' : 'Update failed',
        description: message,
        status: isForbidden ? 'warning' : 'error',
        duration: 4000,
      });
    },
  });

  const exportUsers = async () => {
    try {
      const blob = await usersApi.exportUsers();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Export successful', status: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Export failed';
      const isForbidden = error?.response?.status === 403;

      toast({
        title: isForbidden ? 'Action Not Allowed' : 'Export failed',
        description: message,
        status: isForbidden ? 'warning' : 'error',
        duration: 4000,
      });
    }
  };

  return {
    updateStatus,
    exportUsers,
  };
}
