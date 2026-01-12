import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { Card, CardContent, CardHeader } from '@ielts/ui';
import type { UserProfile } from '../types';

interface ProfileInfoCardProps {
  profile: UserProfile;
}

export function ProfileInfoCard({ profile }: ProfileInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <Heading size="md" color="gray.50">
          Profile Information
        </Heading>
      </CardHeader>
      <CardContent>
        <VStack spacing={3} align="stretch">
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1} textTransform="uppercase" fontWeight="600">
              Name
            </Text>
            <Text color="gray.200" fontSize="md">
              {profile.name}
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1} textTransform="uppercase" fontWeight="600">
              Email
            </Text>
            <Text color="gray.200" fontSize="md">
              {profile.email}
            </Text>
          </Box>
        </VStack>
      </CardContent>
    </Card>
  );
}
