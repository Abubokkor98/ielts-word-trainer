'use client';

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Avatar,
  Text,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuthStore } from '@ielts/auth';
import { axiosInstance } from '@ielts/auth';

export const UserMenu = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const toast = useToast();

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

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear the auth cookie
      document.cookie = 'user_auth_token=; path=/; max-age=0';

      // Navigate to home first with a flag, forcing the protected route to unmount
      // BEFORE we actually clear the auth state.
      router.push('/?logout=success');
    }
  };

  if (!user) {
    return (
      <HStack spacing={3}>
        <Button
          as={Link}
          href="/login"
          variant="ghost"
          size="sm"
          color="gray.300"
        >
          Login
        </Button>
        <Button as={Link} href="/register" colorScheme="brand" size="sm">
          Sign Up
        </Button>
      </HStack>
    );
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded="full"
        variant="link"
        cursor="pointer"
        minW={0}
      >
        <HStack spacing={2}>
          <Avatar size="sm" name={user.name} bg="brand.500" color="white" />
          <VStack
            display={{ base: 'none', md: 'flex' }}
            alignItems="flex-start"
            spacing="0"
            ml="2"
          >
            <Text fontSize="sm" fontWeight="600" color="gray.200">
              {user.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {user.role}
            </Text>
          </VStack>
        </HStack>
      </MenuButton>
      <MenuList bg="gray.800" borderColor="gray.700">
        <MenuItem
          as={Link}
          href="/profile"
          bg="gray.800"
          _hover={{ bg: 'gray.700' }}
          color="gray.200"
        >
          Profile Settings
        </MenuItem>
        <MenuItem
          as={Link}
          href="/analytics"
          bg="gray.800"
          _hover={{ bg: 'gray.700' }}
          color="gray.200"
        >
          My Analytics
        </MenuItem>

        {user.role === 'admin' && (
          <MenuItem
            as={Link}
            href="/admin"
            bg="gray.800"
            _hover={{ bg: 'gray.700' }}
            color="gray.200"
          >
            Admin Panel
          </MenuItem>
        )}

        <MenuDivider borderColor="gray.700" />
        <MenuItem
          onClick={handleLogout}
          bg="gray.800"
          _hover={{ bg: 'gray.700' }}
          color="red.400"
        >
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
