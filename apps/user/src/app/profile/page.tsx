'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
import { useAuthStore } from '@ielts/auth';
import { Button, Input, Card, CardHeader, CardContent } from '@ielts/ui';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  SimpleGrid,
  Skeleton,
} from '@chakra-ui/react';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setUser } = useAuthStore();

  const [name, setName] = useState('');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/users/profile');
      return data.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (newName: string) => {
      const { data } = await axiosInstance.patch('/users/profile', {
        name: newName,
      });
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user', 'profile'], data);
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      toast({ title: 'Profile updated!', status: 'success' });
    },
    onError: (err: any) => {
      toast({
        title: 'Update failed',
        description: err.response?.data?.message,
        status: 'error',
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      await axiosInstance.post('/users/change-password', {
        currentPassword: data.current,
        newPassword: data.new,
      });
    },
    onSuccess: () => {
      toast({ title: 'Password changed successfully!', status: 'success' });
      setPasswords({ current: '', new: '', confirm: '' });
    },
    onError: (err: any) => {
      toast({
        title: 'Password change failed',
        description: err.response?.data?.message,
        status: 'error',
      });
    },
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(name || profile.name);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast({ title: 'Passwords do not match', status: 'error' });
      return;
    }
    if (passwords.new.length < 6) {
      toast({ title: 'Password too short (min 6 chars)', status: 'error' });
      return;
    }
    changePasswordMutation.mutate(passwords);
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.900" py={8}>
        <Container maxW="5xl">
          <VStack spacing={8} align="stretch">
            <Skeleton height="60px" />
            <Skeleton height="400px" />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (isError || !profile) {
    return (
      <Box minH="100vh" bg="gray.900" py={8}>
        <Container maxW="5xl">
          <Text color="red.400">Failed to load profile data.</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Container maxW="6xl">
        <VStack align="stretch" spacing={6}>
          {/* Header */}
          <Box>
            <Heading as="h1" size="xl" color="gray.50" mb={1}>
              Account Settings
            </Heading>
            <Text color="gray.400">Manage your profile and preferences</Text>
          </Box>

          {/* Two Column Layout */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Left Column */}
            <VStack spacing={6} align="stretch">
              {/* Profile Information Card */}
              <Card>
                <CardHeader>
                  <Heading size="md" color="gray.50">
                    Profile Information
                  </Heading>
                </CardHeader>
                <CardContent>
                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        mb={1}
                        textTransform="uppercase"
                        fontWeight="600"
                      >
                        Name
                      </Text>
                      <Text color="gray.200" fontSize="md">
                        {profile.name}
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        mb={1}
                        textTransform="uppercase"
                        fontWeight="600"
                      >
                        Email
                      </Text>
                      <Text color="gray.200" fontSize="md">
                        {profile.email}
                      </Text>
                    </Box>
                  </VStack>
                </CardContent>
              </Card>

              {/* Update Profile Card */}
              <Card>
                <CardHeader>
                  <Heading size="md" color="gray.50">
                    Update Profile
                  </Heading>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile}>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel color="gray.300" fontSize="sm">
                          Display Name
                        </FormLabel>
                        <Input
                          defaultValue={profile.name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        isLoading={updateProfileMutation.isPending}
                        width="full"
                      >
                        Save Changes
                      </Button>
                    </VStack>
                  </form>
                </CardContent>
              </Card>
            </VStack>

            {/* Right Column */}
            <VStack spacing={6} align="stretch">
              {/* Change Password Card */}
              <Card>
                <CardHeader>
                  <Heading size="md" color="gray.50">
                    Change Password
                  </Heading>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel color="gray.300" fontSize="sm">
                          Current Password
                        </FormLabel>
                        <Input
                          type="password"
                          value={passwords.current}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              current: e.target.value,
                            })
                          }
                          placeholder="Enter current password"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel color="gray.300" fontSize="sm">
                          New Password
                        </FormLabel>
                        <Input
                          type="password"
                          value={passwords.new}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              new: e.target.value,
                            })
                          }
                          placeholder="Enter new password"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel color="gray.300" fontSize="sm">
                          Confirm New Password
                        </FormLabel>
                        <Input
                          type="password"
                          value={passwords.confirm}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              confirm: e.target.value,
                            })
                          }
                          placeholder="Confirm new password"
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        isLoading={changePasswordMutation.isPending}
                        width="full"
                      >
                        Update Password
                      </Button>
                    </VStack>
                  </form>
                </CardContent>
              </Card>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
