'use client';

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useProfile } from './hooks/use-profile';
import { ProfileInfoCard } from './components/profile-info-card';
import { UpdateProfileForm } from './components/update-profile-form';
import { ChangePasswordForm } from './components/change-password-form';
import { ProfileSkeleton } from './components/profile-skeleton';
import { ProfileErrorState } from './components/profile-error-state';

export function ProfileContainer() {
  const {
    profile,
    isLoading,
    isError,
    updateProfile,
    isUpdatingProfile,
    changePassword,
    isChangingPassword,
  } = useProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    return <ProfileErrorState />;
  }

  return (
    <Box bg="gray.900" py={8}>
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
              <ProfileInfoCard profile={profile} />
              <UpdateProfileForm
                profile={profile}
                onUpdate={updateProfile}
                isLoading={isUpdatingProfile}
              />
            </VStack>

            {/* Right Column */}
            <VStack spacing={6} align="stretch">
              <ChangePasswordForm
                onChangePassword={changePassword}
                isLoading={isChangingPassword}
              />
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
