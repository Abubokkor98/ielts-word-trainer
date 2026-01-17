'use client';

import {
  Badge,
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { User as AuthUser } from '@ielts/auth';
import {
  BarChart2,
  Book,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  RotateCcw,
  Settings,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { MobileNavLink } from './nav-links';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: AuthUser | null;
  onLogout: () => void;
  dueCount: number;
}

export const MobileNav = ({
  isOpen,
  onClose,
  isAuthenticated,
  user,
  onLogout,
  dueCount,
}: MobileNavProps) => {
  return (
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
            <MobileNavLink href="/" icon={<Home size={20} />} onClick={onClose}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/vocabulary" icon={<Book size={20} />} onClick={onClose}>
              Vocabulary
            </MobileNavLink>
            <MobileNavLink href="/quiz" icon={<HelpCircle size={20} />} onClick={onClose}>
              Quiz
            </MobileNavLink>

            <Divider my={2} borderColor="whiteAlpha.200" />

            {/* Authenticated Navigation */}
            {isAuthenticated ? (
              <>
                <Box px={4} py={2}>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    User Account
                  </Text>
                </Box>
                <MobileNavLink
                  href="/dashboard"
                  icon={<LayoutDashboard size={20} />}
                  onClick={onClose}
                >
                  Dashboard
                </MobileNavLink>
                <MobileNavLink href="/profile" icon={<User size={20} />} onClick={onClose}>
                  Profile Settings
                </MobileNavLink>
                <MobileNavLink href="/review" icon={<RotateCcw size={20} />} onClick={onClose}>
                  <Flex justify="space-between" w="full" align="center">
                    <Text>Review</Text>
                    {dueCount > 0 && (
                      <Badge colorScheme="red" variant="solid" borderRadius="full" fontSize="xs">
                        {dueCount}
                      </Badge>
                    )}
                  </Flex>
                </MobileNavLink>
                <MobileNavLink href="/analytics" icon={<BarChart2 size={20} />} onClick={onClose}>
                  Analytics
                </MobileNavLink>
                {user?.role === 'admin' && (
                  <MobileNavLink href="/admin" icon={<Settings size={20} />} onClick={onClose}>
                    Admin Panel
                  </MobileNavLink>
                )}

                <MobileNavLink icon={<LogOut size={20} />} onClick={onLogout} color="red.400">
                  Sign Out
                </MobileNavLink>
              </>
            ) : (
              <>
                <Box px={4} py={2}>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Account
                  </Text>
                </Box>
                <MobileNavLink href="/login" icon={<LogIn size={20} />} onClick={onClose}>
                  Login
                </MobileNavLink>
                <MobileNavLink
                  href="/register"
                  icon={<UserPlus size={20} />}
                  onClick={onClose}
                  color="brand.400"
                >
                  Sign Up
                </MobileNavLink>
              </>
            )}
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" borderColor="whiteAlpha.200" justifyContent="center">
          <Text fontSize="xs" color="gray.500">
            IELTS Vocabulary Builder
          </Text>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
