'use client';

import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  IconButton,
} from '@chakra-ui/react';
import Link from 'next/link';
import { UserMenu } from '@ielts/ui';
import { Menu } from 'lucide-react';

import { useNavbar } from './use-navbar';
import { DesktopNav } from './desktop-nav';
import { MobileNav } from './mobile-nav';

export const UserNavbar = () => {
  const {
    isOpen,
    onOpen,
    onClose,
    isAuthenticated,
    user,
    handleLogout,
    dueCount,
  } = useNavbar();

  return (
    <>
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 999,
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '0';
          e.currentTarget.style.top = '0';
          e.currentTarget.style.padding = '1rem';
          e.currentTarget.style.background = '#1a202c';
          e.currentTarget.style.color = '#fff';
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-9999px';
        }}
      >
        Skip to main content
      </a>

      {/* Main Navbar */}
      <Box
        bg="gray.900"
        borderBottom="1px"
        borderColor="gray.800"
        position="sticky"
        top="0"
        zIndex={10}
        as="nav"
        role="navigation"
        aria-label="Main navigation"
      >
        <Container maxW="7xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Logo and Desktop Navigation */}
            <HStack spacing={8} alignItems="center">
              <Heading
                as={Link}
                href="/"
                size="md"
                color="white"
                fontWeight="bold"
                _hover={{ textDecoration: 'none' }}
              >
                IELTS Master
              </Heading>

              <DesktopNav
                isAuthenticated={isAuthenticated}
                dueCount={dueCount}
              />
            </HStack>

            {/* User Menu - Right Side (Desktop Only) */}
            <Flex alignItems="center" display={{ base: 'none', lg: 'flex' }}>
              <UserMenu />
            </Flex>

            {/* Mobile hamburger menu - Right Side */}
            <IconButton
              size="md"
              icon={<Menu size={24} />}
              aria-label="Open menu"
              display={{ base: 'flex', lg: 'none' }}
              variant="ghost"
              color="white"
              onClick={onOpen}
              minW="48px"
              minH="48px"
            />
          </Flex>
        </Container>
      </Box>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isOpen}
        onClose={onClose}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        dueCount={dueCount}
      />
    </>
  );
};
