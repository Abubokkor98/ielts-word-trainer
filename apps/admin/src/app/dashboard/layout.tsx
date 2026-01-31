'use client';

import { Sidebar } from '@ielts/ui';
import { useIsViewer } from '@ielts/auth';
import { Alert, AlertIcon, Box, Text } from '@chakra-ui/react';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isViewer = useIsViewer();

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <main
        id="main-content"
        className={`flex-1 p-4 md:p-8 transition-all duration-200 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {isViewer && (
          <Alert
            status="info"
            mb={6}
            borderRadius="md"
            bg="blue.900"
            borderColor="blue.700"
            borderWidth="1px"
          >
            <AlertIcon color="blue.300" />
            <Box>
              <Text fontWeight="bold" color="blue.100">
                Demo Mode (Read-Only Access)
              </Text>
              <Text fontSize="sm" color="blue.200" mt={1}>
                You're viewing as a demo user. All create, edit, and delete
                operations are disabled to protect production data.
              </Text>
            </Box>
          </Alert>
        )}
        {children}
      </main>
    </div>
  );
}
