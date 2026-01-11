'use client';

import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Container,
  Heading,
  Link as ChakraLink,
  Badge,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from '@ielts/ui';
import { useAuthStore } from '@ielts/auth';

const HamburgerIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <ChakraLink
      as={Link}
      href={href}
      px={3}
      py={2}
      rounded="md"
      fontWeight={isActive ? '600' : '500'}
      color={isActive ? 'brand.400' : 'gray.300'}
      _hover={{
        textDecoration: 'none',
        bg: 'gray.800',
        color: 'white',
      }}
      role="menuitem"
    >
      {children}
    </ChakraLink>
  );
};

export const UserNavbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated } = useAuthStore();

  const { data: srsStats } = useQuery({
    queryKey: ['srs', 'stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/srs/stats');
      return data.data;
    },
    enabled: isAuthenticated,
    // Don't refetch too often to avoid sticker flicker/load
    staleTime: 60 * 1000,
  });

  const dueCount = srsStats?.dueToday || 0;

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
            <IconButton
              size="md"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              display={{ md: 'none' }}
              variant="ghost"
              color="white"
              onClick={isOpen ? onClose : onOpen}
            />
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
              <HStack
                as="nav"
                spacing={4}
                display={{ base: 'none', md: 'flex' }}
                role="menubar"
              >
                <NavLink href="/">Home</NavLink>
                <NavLink href="/vocabulary">Vocabulary</NavLink>
                <NavLink href="/quiz">Quiz</NavLink>
                {isAuthenticated && (
                  <>
                    <NavLink href="/dashboard">Dashboard</NavLink>
                    <NavLink href="/review">
                      Review
                      {dueCount > 0 && (
                        <Badge
                          ml={2}
                          colorScheme="red"
                          variant="solid"
                          borderRadius="full"
                          fontSize="xs"
                        >
                          {dueCount}
                        </Badge>
                      )}
                    </NavLink>
                  </>
                )}
              </HStack>
            </HStack>
            <Flex alignItems="center">
              <UserMenu />
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as="nav" spacing={4} role="menu">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/vocabulary">Vocabulary</NavLink>
                <NavLink href="/quiz">Quiz</NavLink>
                {isAuthenticated && (
                  <NavLink href="/dashboard">Dashboard</NavLink>
                )}
              </Stack>
            </Box>
          ) : null}
        </Container>
      </Box>
    </>
  );
};
