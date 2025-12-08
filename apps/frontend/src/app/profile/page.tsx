'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
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
} from '@chakra-ui/react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
  streak: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Edit profile state
  const [name, setName] = useState('');

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Please login first',
          status: 'warning',
          duration: 3000,
          position: 'top',
        });
        router.push('/login');
        return;
      }

      const { data } = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProfile(data.data);
        setName(data.data.name);
      }
    } catch (err: any) {
      toast({
        title: 'Error loading profile',
        description: err.response?.data?.message || 'Unable to fetch profile',
        status: 'error',
        duration: 5000,
        position: 'top',
      });
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await api.patch(
        '/users/profile',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast({
          title: 'Profile updated!',
          description: 'Your profile has been updated successfully.',
          status: 'success',
          duration: 3000,
          position: 'top',
        });

        // Update local storage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.name = name;
        localStorage.setItem('user', JSON.stringify(user));

        setProfile(data.data);
      }
    } catch (err: any) {
      toast({
        title: 'Update failed',
        description: err.response?.data?.message || 'Unable to update profile',
        status: 'error',
        duration: 5000,
        position: 'top',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your new passwords match.',
        status: 'error',
        duration: 5000,
        position: 'top',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        status: 'error',
        duration: 5000,
        position: 'top',
      });
      return;
    }

    setChangingPassword(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await api.post(
        '/users/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast({
          title: 'Password changed!',
          description: 'Your password has been changed successfully.',
          status: 'success',
          duration: 3000,
          position: 'top',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      toast({
        title: 'Change password failed',
        description: err.response?.data?.message || 'Unable to change password',
        status: 'error',
        duration: 5000,
        position: 'top',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Text fontSize="xl" color="gray.400">
            Loading profile...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box
        minH="100vh"
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Text fontSize="xl" color="gray.400">
            Unable to load profile
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Container maxW="5xl">
        <VStack align="stretch" spacing={8}>
          {/* Header */}
          <Box>
            <Heading as="h1" size="2xl" color="gray.50" mb={2}>
              Profile Settings
            </Heading>
            <Text fontSize="lg" color="gray.400">
              Manage your account settings and preferences
            </Text>
          </Box>

          {/* User Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card>
              <CardContent>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.400" fontWeight="600">
                    TOTAL XP
                  </Text>
                  <Heading size="2xl" color="brand.400">
                    {profile.xp}
                  </Heading>
                </VStack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.400" fontWeight="600">
                    STREAK
                  </Text>
                  <HStack>
                    <Heading size="2xl" color="warning.400">
                      {profile.streak}
                    </Heading>
                    <Text fontSize="xl">🔥</Text>
                  </HStack>
                </VStack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.400" fontWeight="600">
                    ROLE
                  </Text>
                  <Badge
                    colorScheme={profile.role === 'admin' ? 'purple' : 'blue'}
                    fontSize="lg"
                    px={3}
                    py={1}
                  >
                    {profile.role}
                  </Badge>
                </VStack>
              </CardContent>
            </Card>
          </SimpleGrid>

          {/* Tabs for different sections */}
          <Tabs colorScheme="brand" variant="enclosed">
            <TabList borderColor="gray.700">
              <Tab
                color="gray.400"
                _selected={{ color: 'brand.400', borderColor: 'brand.400' }}
              >
                Profile Information
              </Tab>
              <Tab
                color="gray.400"
                _selected={{ color: 'brand.400', borderColor: 'brand.400' }}
              >
                Edit Profile
              </Tab>
              <Tab
                color="gray.400"
                _selected={{ color: 'brand.400', borderColor: 'brand.400' }}
              >
                Change Password
              </Tab>
            </TabList>

            <TabPanels>
              {/* Profile Information Tab */}
              <TabPanel px={0} py={6}>
                <Card>
                  <CardHeader>
                    <Heading size="md" color="gray.50">
                      Account Information
                    </Heading>
                  </CardHeader>
                  <CardContent>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between">
                        <Text color="gray.400" fontWeight="600">
                          Name:
                        </Text>
                        <Text color="gray.200">{profile.name}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.400" fontWeight="600">
                          Email:
                        </Text>
                        <Text color="gray.200">{profile.email}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.400" fontWeight="600">
                          User ID:
                        </Text>
                        <Text color="gray.200" fontSize="sm">
                          {profile.id}
                        </Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.400" fontWeight="600">
                          Account Type:
                        </Text>
                        <Badge
                          colorScheme={
                            profile.role === 'admin' ? 'purple' : 'blue'
                          }
                        >
                          {profile.role}
                        </Badge>
                      </HStack>
                    </VStack>
                  </CardContent>
                </Card>
              </TabPanel>

              {/* Edit Profile Tab */}
              <TabPanel px={0} py={6}>
                <Card>
                  <CardHeader>
                    <Heading size="md" color="gray.50">
                      Update Profile
                    </Heading>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile}>
                      <VStack spacing={6} align="stretch">
                        <FormControl isRequired>
                          <FormLabel fontWeight="bold" color="gray.300">
                            Name
                          </FormLabel>
                          <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="bold" color="gray.300">
                            Email
                          </FormLabel>
                          <Input
                            type="email"
                            value={profile.email}
                            isDisabled
                            bg="gray.700"
                            cursor="not-allowed"
                          />
                          <Text fontSize="sm" color="gray.500" mt={1}>
                            Email cannot be changed
                          </Text>
                        </FormControl>

                        <Button
                          type="submit"
                          width="full"
                          isLoading={updating}
                          loadingText="Updating..."
                        >
                          Update Profile
                        </Button>
                      </VStack>
                    </form>
                  </CardContent>
                </Card>
              </TabPanel>

              {/* Change Password Tab */}
              <TabPanel px={0} py={6}>
                <Card>
                  <CardHeader>
                    <Heading size="md" color="gray.50">
                      Change Password
                    </Heading>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleChangePassword}>
                      <VStack spacing={6} align="stretch">
                        <FormControl isRequired>
                          <FormLabel fontWeight="bold" color="gray.300">
                            Current Password
                          </FormLabel>
                          <Input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontWeight="bold" color="gray.300">
                            New Password
                          </FormLabel>
                          <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password (min 6 characters)"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontWeight="bold" color="gray.300">
                            Confirm New Password
                          </FormLabel>
                          <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                          />
                        </FormControl>

                        <Button
                          type="submit"
                          width="full"
                          isLoading={changingPassword}
                          loadingText="Changing password..."
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
