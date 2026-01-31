'use client';

import { SimpleGrid } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface StatsGridProps {
  children: ReactNode;
}

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <SimpleGrid columns={{ base: 1, md: 3, xl: 5 }} spacing={6} w="full">
      {children}
    </SimpleGrid>
  );
}
