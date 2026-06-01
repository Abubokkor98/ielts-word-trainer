'use client';

import { Button, Input, Label, useToast } from '@ielts/ui';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export function ProfileForm() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      name: user?.name || '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await axiosInstance.patch('/admin/profile', data);
      return response.data;
    },
    onSuccess: (_response, variables) => {
      if (user) {
         useAuthStore.getState().setUser({ ...user, name: variables.name });
      }
      toast({ title: 'Profile updated successfully' });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Failed to update profile',
        description: err.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: { name: string }) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
      <div className="space-y-2">
        <Label htmlFor="profile-email">Email</Label>
        <Input
          id="profile-email"
          value={user?.email || ''}
          readOnly
          className="cursor-not-allowed bg-muted opacity-80"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-name">Name</Label>
        <Input
          id="profile-name"
          {...register('name', { required: 'Name is required' })}
          className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={updateProfileMutation.isPending}
        className="px-6"
      >
        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}

