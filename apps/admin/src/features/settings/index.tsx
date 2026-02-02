'use client';

import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { Card, CardContent } from '@ielts/ui';
import { Lock, User } from 'lucide-react';
import { ProfileForm } from './components/ProfileForm';
import { SecurityForm } from './components/SecurityForm';

export function SettingsContainer() {
  return (
    <Box maxW="container.lg" mx="auto" py={6}>
      <Heading size="lg" mb={6}>
        Account Settings
      </Heading>

      <Tabs variant="enclosed" colorScheme="brand" isLazy>
        <TabList mb={4}>
          <Tab gap={2}>
            <User size={18} />
            Profile
          </Tab>
          <Tab gap={2}>
            <Lock size={18} />
            Security
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Card>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel px={0}>
            <Card>
              <CardContent>
                <SecurityForm />
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
