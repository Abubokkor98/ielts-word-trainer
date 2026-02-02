import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function ProfileForm() {
  const { user } = useAuthStore();
  const toast = useToast();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name });
    }
  }, [user, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await axiosInstance.patch('/admin/profile', data);
      return response.data;
    },
    onSuccess: (_response, variables) => {
      if (user) {
        useAuthStore.getState().setUser({ ...user, name: variables.name });
      }
      toast({ title: 'Profile updated successfully', status: 'success' });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Failed to update profile',
        description: err.response?.data?.message || 'An error occurred',
        status: 'error',
      });
    },
  });

  const onSubmit = (data: { name: string }) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align="start" maxW="lg">
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            value={user?.email || ''}
            isReadOnly
            cursor="not-allowed"
            _readOnly={{
              bg: 'gray.100',
              _dark: { bg: 'whiteAlpha.100' },
              opacity: 1,
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input {...register('name', { required: true })} />
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          isLoading={updateProfileMutation.isPending}
        >
          Save Changes
        </Button>
      </VStack>
    </form>
  );
}
