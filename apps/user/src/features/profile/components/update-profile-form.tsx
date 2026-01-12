import { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { Card, CardHeader, CardContent } from '@ielts/ui';
import { Heading } from '@chakra-ui/react';
import { UserProfile, UpdateProfileRequest } from '../types';

interface UpdateProfileFormProps {
  profile: UserProfile;
  onUpdate: (data: UpdateProfileRequest) => void;
  isLoading: boolean;
}

export function UpdateProfileForm({
  profile,
  onUpdate,
  isLoading,
}: UpdateProfileFormProps) {
  const [name, setName] = useState(profile.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ name });
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md" color="gray.50">
          Update Profile
        </Heading>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel color="gray.300" fontSize="sm">
                Display Name
              </FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </FormControl>
            <Button type="submit" isLoading={isLoading} width="full">
              Save Changes
            </Button>
          </VStack>
        </form>
      </CardContent>
    </Card>
  );
}
