import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { axiosInstance } from '@ielts/auth';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { PasswordFormData } from '../types';

export function SecurityForm() {
  const toast = useToast();

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
      toast({ title: 'Password changed successfully', status: 'success' });
      reset();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Failed to change password',
        description: err.response?.data?.message || 'An error occurred',
        status: 'error',
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align="start" maxW="lg">
        <FormControl isRequired isInvalid={!!errors.currentPassword}>
          <FormLabel>Current Password</FormLabel>
          <Input
            type="password"
            {...register('currentPassword', {
              required: 'Current password is required',
            })}
          />
          <FormErrorMessage>{errors.currentPassword?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.newPassword}>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            {...register('newPassword', {
              required: true,
              minLength: { value: 6, message: 'Minimum 6 characters' },
            })}
          />
          <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.confirmPassword}>
          <FormLabel>Confirm New Password</FormLabel>
          <Input
            type="password"
            {...register('confirmPassword', {
              required: true,
              validate: (value, formValues) =>
                value === formValues.newPassword || 'Passwords do not match',
            })}
          />
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          isLoading={changePasswordMutation.isPending}
        >
          Update Password
        </Button>
      </VStack>
    </form>
  );
}
