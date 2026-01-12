import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../services/profile.api';
import type { ChangePasswordRequest, UpdateProfileRequest } from '../types';

export function useProfile() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setUser } = useAuthStore();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: profileApi.getProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfileRequest) => profileApi.updateProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['user', 'profile'], data);

      // Merge with existing user to preserve role and other fields
      // Merge with existing user to preserve role and other fields
      const currentUser = useAuthStore.getState().user;

      // Strip _id to match User type expected by store
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...userDataForStore } = data;

      if (currentUser) {
        setUser({ ...currentUser, ...userDataForStore });
      } else {
        setUser(userDataForStore);
      }

      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      toast({ title: 'Profile updated!', status: 'success' });
    },
    onError: (err: any) => {
      toast({
        title: 'Update failed',
        description: err.response?.data?.message || 'Something went wrong',
        status: 'error',
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (payload: ChangePasswordRequest) => profileApi.changePassword(payload),
    onSuccess: () => {
      toast({ title: 'Password changed successfully!', status: 'success' });
    },
    onError: (err: any) => {
      toast({
        title: 'Password change failed',
        description: err.response?.data?.message || 'Something went wrong',
        status: 'error',
      });
    },
  });

  return {
    profile,
    isLoading,
    isError,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  };
}
