import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UsersQueryParams, UsersResponse } from '../types';
import { usersApi } from '../services/users.api';

export function useUsers(params: UsersQueryParams) {
  const { user } = useAuthStore();

  return useQuery<UsersResponse, Error>({
    queryKey: ['admin', 'users', params.page, params.limit, params.search],
    queryFn: () => usersApi.getUsers(params),
    enabled: !!user && ['admin', 'super_admin'].includes(user.role),
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
    onError: () => {
      toast({ title: 'Failed to update user status', status: 'error' });
    },
  });

  const exportUsers = async () => {
    try {
      const blob = await usersApi.exportUsers();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Export successful', status: 'success' });
    } catch (_error) {
      toast({ title: 'Export failed', status: 'error' });
    }
  };

  return {
    updateStatus,
    exportUsers,
  };
}
