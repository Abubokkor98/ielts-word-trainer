'use client';

import { Box, Heading, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface DashboardSectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export function DashboardSection({
  title,
  subtitle,
  children,
}: DashboardSectionProps) {
  return (
    <Box as="section" w="full">
      <VStack align="stretch" spacing={4}>
        {(title || subtitle) && (
          <Box mb={2}>
            {title && (
              <Heading
                size="lg"
                fontWeight="bold"
                color="gray.700"
                _dark={{ color: 'gray.100' }}
              >
                {title}
              </Heading>
            )}
            {subtitle && (
              <Box
                fontSize="md"
                color="gray.500"
                _dark={{ color: 'gray.400' }}
                mt={1}
              >
                {subtitle}
              </Box>
            )}
          </Box>
        )}
        {children}
      </VStack>
    </Box>
  );
}
