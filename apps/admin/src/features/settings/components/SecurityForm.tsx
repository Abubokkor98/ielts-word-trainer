'use client';

import { Button, Input, Label, useToast } from '@ielts/ui';
import { axiosInstance } from '@ielts/auth';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { PasswordFormData } from '../types';

export function SecurityForm() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>();

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      await axiosInstance.post('/admin/change-password', data);
    },
    onSuccess: () => {
      toast({ title: 'Password changed successfully' });
      reset();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Failed to change password',
        description: err.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          {...register('currentPassword', {
            required: 'Current password is required',
          })}
          className={errors.currentPassword ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.currentPassword && (
          <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          {...register('newPassword', {
            required: 'New password is required',
            minLength: { value: 6, message: 'Minimum 6 characters' },
          })}
          className={errors.newPassword ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword', {
            required: 'Confirming password is required',
            validate: (value, formValues) =>
              value === formValues.newPassword || 'Passwords do not match',
          })}
          className={errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={changePasswordMutation.isPending}
        className="px-6"
      >
        {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  );
}

