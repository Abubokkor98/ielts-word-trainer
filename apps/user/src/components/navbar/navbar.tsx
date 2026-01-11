'use client';

import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Container,
  Heading,
  Link as ChakraLink,
  Badge,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  VStack,
  Divider,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from '@ielts/ui';
import { useAuthStore } from '@ielts/auth';
import {
  Home,
  Book,
  HelpCircle,
  LayoutDashboard,
  RotateCcw,
  BarChart2,
  Menu,
  X,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';

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

interface MobileNavLinkProps {
  href: string;
  icon: React.ReactElement;
  children: React.ReactNode;
  onClick: () => void;
}

const MobileNavLink = ({
  href,
  icon,
  children,
  onClick,
}: MobileNavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <ChakraLink
      as={Link}
      href={href}
      onClick={onClick}
      display="flex"
      alignItems="center"
      gap={3}
      px={4}
      py={3}
      rounded="md"
      fontWeight={isActive ? '600' : '500'}
      color={isActive ? 'brand.400' : 'gray.300'}
      _hover={{
        bg: 'gray.800',
        color: 'white',
        textDecoration: 'none',
      }}
      minH="48px"
      transition="all 0.2s"
    >
      <Box fontSize="20px" color={isActive ? 'brand.400' : 'gray.400'}>
        {icon}
      </Box>
      <Box flex="1">{children}</Box>
    </ChakraLink>
  );
};

export const UserNavbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated, user, logout } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check if we just logged out via redirection
    if (searchParams.get('logout') === 'success' && user) {
      logout();
      queryClient.clear();

      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 2000,
      });

      // Clear the query param
      router.replace('/');
    }
  }, [searchParams, user, logout, queryClient, toast, router]);

  const { data: srsStats } = useQuery({
    queryKey: ['srs', 'stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/srs/stats');
      return data.data;
    },
    enabled: isAuthenticated,
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
            {/* User Menu - Left Side (Mobile Only) */}
            <Flex alignItems="center" display={{ base: 'flex', lg: 'none' }}>
              <UserMenu />
            </Flex>

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

              {/* Desktop Navigation - Hidden on mobile */}
              <HStack
                as="nav"
                spacing={4}
                display={{ base: 'none', lg: 'flex' }}
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
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <DrawerContent
          bg="rgba(17, 24, 39, 0.85)"
          backdropFilter="blur(16px) saturate(180%)"
          borderLeft="1px solid"
          borderColor="whiteAlpha.200"
          boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
        >
          <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
            <Flex justify="space-between" align="center">
              <Heading size="md" color="white">
                Menu
              </Heading>
              <IconButton
                aria-label="Close menu"
                icon={<X size={20} />}
                onClick={onClose}
                variant="ghost"
                size="sm"
                color="gray.400"
                _hover={{ color: 'white', bg: 'gray.800' }}
                minW="48px"
                minH="48px"
              />
            </Flex>
          </DrawerHeader>

          <DrawerBody px={2} py={4}>
            <VStack spacing={1} align="stretch">
              {/* Public Navigation */}
              <MobileNavLink
                href="/"
                icon={<Home size={20} />}
                onClick={onClose}
              >
                Home
              </MobileNavLink>
              <MobileNavLink
                href="/vocabulary"
                icon={<Book size={20} />}
                onClick={onClose}
              >
                Vocabulary
              </MobileNavLink>
              <MobileNavLink
                href="/quiz"
                icon={<HelpCircle size={20} />}
                onClick={onClose}
              >
                Quiz
              </MobileNavLink>

              {/* Authenticated Navigation */}
              {isAuthenticated && (
                <>
                  <Divider my={2} borderColor="whiteAlpha.200" />
                  <MobileNavLink
                    href="/dashboard"
                    icon={<LayoutDashboard size={20} />}
                    onClick={onClose}
                  >
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink
                    href="/review"
                    icon={<RotateCcw size={20} />}
                    onClick={onClose}
                  >
                    <Flex justify="space-between" w="full" align="center">
                      <Text>Review</Text>
                      {dueCount > 0 && (
                        <Badge
                          colorScheme="red"
                          variant="solid"
                          borderRadius="full"
                          fontSize="xs"
                        >
                          {dueCount}
                        </Badge>
                      )}
                    </Flex>
                  </MobileNavLink>
                  <MobileNavLink
                    href="/analytics"
                    icon={<BarChart2 size={20} />}
                    onClick={onClose}
                  >
                    Analytics
                  </MobileNavLink>
                </>
              )}
            </VStack>
          </DrawerBody>

          <DrawerFooter
            borderTopWidth="1px"
            borderColor="whiteAlpha.200"
            justifyContent="center"
          >
            <Text fontSize="xs" color="gray.500">
              IELTS Vocabulary Builder
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
