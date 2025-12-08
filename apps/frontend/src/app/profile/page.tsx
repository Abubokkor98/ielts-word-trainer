'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { useAuthStore } from '../../store/auth.store';
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

  const { data: profile, isLoading } = useQuery({
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
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height="100px" />
              ))}
            </SimpleGrid>
            <Skeleton height="400px" />
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Container maxW="5xl">
        <VStack align="stretch" spacing={8}>
          <Box>
            <Heading as="h1" size="2xl" color="gray.50" mb={2}>
              Profile Settings
            </Heading>
            <Text color="gray.400">Manage your account</Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <StatCard label="TOTAL XP" value={profile.xp} color="brand.400" />
            <StatCard
              label="STREAK"
              value={profile.streak}
              icon="🔥"
              color="warning.400"
            />
            <StatCard label="ROLE" value={profile.role} isBadge />
          </SimpleGrid>

          <Tabs colorScheme="brand" variant="enclosed">
            <TabList borderColor="gray.700">
              <Tab
                color="gray.400"
                _selected={{ color: 'brand.400', borderColor: 'brand.400' }}
              >
                Info
              </Tab>
              <Tab
                color="gray.400"
                _selected={{ color: 'brand.400', borderColor: 'brand.400' }}
              >
                Edit
              </Tab>
              <Tab
                color="gray.400"
                _selected={{ color: 'brand.400', borderColor: 'brand.400' }}
              >
                Password
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Card>
                  <CardHeader>
                    <Heading size="md" color="gray.50">
                      Profile Information
                    </Heading>
                  </CardHeader>
                  <CardContent>
                    <VStack align="stretch" spacing={4}>
                      <InfoRow label="Name" value={profile.name} />
                      <InfoRow label="Email" value={profile.email} />
                      <InfoRow label="ID" value={profile.id} />
                    </VStack>
                  </CardContent>
                </Card>
              </TabPanel>

              <TabPanel>
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
                          <FormLabel color="gray.300">Name</FormLabel>
                          <Input
                            defaultValue={profile.name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </FormControl>
                        <Button
                          type="submit"
                          isLoading={updateProfileMutation.isPending}
                          w="full"
                        >
                          Update
                        </Button>
                      </VStack>
                    </form>
                  </CardContent>
                </Card>
              </TabPanel>

              <TabPanel>
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
                          <FormLabel color="gray.300">
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
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel color="gray.300">New Password</FormLabel>
                          <Input
                            type="password"
                            value={passwords.new}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                new: e.target.value,
                              })
                            }
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel color="gray.300">
                            Confirm Password
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
                          />
                        </FormControl>
                        <Button
                          type="submit"
                          isLoading={changePasswordMutation.isPending}
                          w="full"
                        >
                          Change Password
                        </Button>
                      </VStack>
                    </form>
                  </CardContent>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}

const StatCard = ({ label, value, icon, color, isBadge }: any) => (
  <Card>
    <CardContent>
      <VStack align="start" spacing={1}>
        <Text fontSize="sm" color="gray.400" fontWeight="600">
          {label}
        </Text>
        {isBadge ? (
          <Badge
            colorScheme={value === 'admin' ? 'purple' : 'blue'}
            fontSize="lg"
          >
            {value}
          </Badge>
        ) : (
          <HStack>
            <Heading size="2xl" color={color}>
              {value}
            </Heading>
            {icon && <Text fontSize="2xl">{icon}</Text>}
          </HStack>
        )}
      </VStack>
    </CardContent>
  </Card>
);

const InfoRow = ({ label, value }: any) => (
  <HStack justify="space-between">
    <Text color="gray.400" fontWeight="600">
      {label}:
    </Text>
    <Text color="gray.200">{value}</Text>
  </HStack>
);
