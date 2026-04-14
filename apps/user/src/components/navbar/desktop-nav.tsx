'use client';

import { Badge, HStack } from '@chakra-ui/react';
import { NavLink } from './nav-links';

interface DesktopNavProps {
  isAuthenticated: boolean;
  dueCount: number;
}

export const DesktopNav = ({ isAuthenticated, dueCount }: DesktopNavProps) => {
  return (
    <HStack as="nav" spacing={4} display={{ base: 'none', lg: 'flex' }} role="menubar">
      <NavLink href="/">Home</NavLink>
      <NavLink href="/vocabulary">Vocabulary</NavLink>
      <NavLink href="/quiz">Quiz</NavLink>
      {isAuthenticated && (
        <>
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/my-lists">My Lists</NavLink>
          <NavLink href="/review">
            Review
            {dueCount > 0 && (
              <Badge ml={2} colorScheme="red" variant="solid" borderRadius="full" fontSize="xs">
                {dueCount}
              </Badge>
            )}
          </NavLink>
        </>
      )}
    </HStack>
  );
};
