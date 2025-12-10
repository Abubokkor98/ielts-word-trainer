'use client';

import {
  Box,
  Heading,
  VStack,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Divider,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const toast = useToast();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { isSubmitting: isProfileSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await axiosInstance.patch('/users/profile', data);
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Update local auth store with new user data
      if (user) {
        useAuthStore
          .getState()
          .setUser({ ...user, name: variables.name } as any);
      }
      toast({ title: 'Profile updated successfully', status: 'success' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update profile',
        description: error.response?.data?.message,
        status: 'error',
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      await axiosInstance.post('/users/change-password', data);
    },
    onSuccess: () => {
      toast({ title: 'Password changed successfully', status: 'success' });
      resetPassword();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to change password',
        description: error.response?.data?.message,
        status: 'error',
      });
    },
  });

  const onProfileSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: any) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <Box maxW="container.md" mx="auto">
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Account Settings</Heading>

        <Card>
          <CardHeader>
            <Heading size="md">Profile Information</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <VStack spacing={4} align="start">
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input value={user?.email} isReadOnly bg="gray.50" />
                </FormControl>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input {...registerProfile('name', { required: true })} />
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
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Change Password</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <VStack spacing={4} align="start">
                <FormControl isRequired>
                  <FormLabel>Current Password</FormLabel>
                  <Input
                    type="password"
                    {...registerPassword('currentPassword', { required: true })}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    {...registerPassword('newPassword', {
                      required: true,
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={!!passwordErrors.confirmPassword}
                >
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input
                    type="password"
                    {...registerPassword('confirmPassword', {
                      required: true,
                      validate: (value, formValues) =>
                        value === formValues.newPassword ||
                        'Passwords do not match',
                    })}
                  />
                  <FormErrorMessage>
                    {passwordErrors.confirmPassword &&
                      (passwordErrors.confirmPassword.message as string)}
                  </FormErrorMessage>
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
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
