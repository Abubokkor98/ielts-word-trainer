'use client';

import {
  Avatar,
  Box,
  Link as ChakraLink,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarItemProps {
  icon: any;
  label: string;
  href: string;
  isCollapsed?: boolean;
}

const SidebarItem = ({ icon, label, href, isCollapsed }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  // High contrast active state
  const activeBg = useColorModeValue(
    'linear-gradient(90deg, var(--chakra-colors-brand-50) 0%, transparent 100%)',
    'linear-gradient(90deg, rgba(66, 165, 245, 0.15) 0%, transparent 100%)',
  );
  const activeColor = useColorModeValue('brand.700', 'brand.300'); // Lighter brand color for dark mode
  const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const activeBorder = useColorModeValue('brand.600', 'brand.400');

  return (
    <Tooltip label={isCollapsed ? label : ''} placement="right" hasArrow>
      <ChakraLink
        as={Link}
        href={href}
        display="flex"
        alignItems="center"
        justifyContent={isCollapsed ? 'center' : 'flex-start'}
        w="full"
        p={3}
        position="relative"
        borderRadius="lg"
        borderLeftRadius={isCollapsed ? 'lg' : 0}
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : 'gray.400'}
        _hover={{
          bg: isActive ? activeBg : hoverBg,
          color: isActive ? activeColor : 'white',
          textDecoration: 'none',
        }}
        _before={
          isActive && !isCollapsed
            ? {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 2,
                bottom: 2,
                width: '3px',
                bg: activeBorder,
                borderRadius: 'full',
              }
            : {}
        }
        transition="all 0.2s"
      >
        <Icon as={icon} boxSize={5} color={isActive ? activeColor : 'gray.500'} />
        {!isCollapsed && (
          <Text ml={3} fontWeight={isActive ? 'bold' : '500'} fontSize="sm">
            {label}
          </Text>
        )}
      </ChakraLink>
    </Tooltip>
  );
};

export const AdminSidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuthStore();
  const borderColor = useColorModeValue('gray.200', 'gray.800');
  const bgColor = useColorModeValue('white', 'gray.900');
  const pathname = usePathname();
  const toast = useToast();
  const _router = useRouter();

  const handleLogout = () => {
    // Clear auth cookie first
    document.cookie = 'admin_auth_token=; path=/; max-age=0';

    // Clear auth state
    logout();

    // Force clear local storage to ensure no persisted state survives
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
    }

    // Show success toast
    toast({
      title: 'Logged out successfully',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

    // Use window.location.replace to ensure clean redirect without history
    // and force a full reload to clear any memory/state
    setTimeout(() => {
      window.location.replace('/');
    }, 100);
  };

  // Hide sidebar on login page
  if (pathname === '/login') {
    return null;
  }

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Shield, label: 'Admins', href: '/dashboard/admins' },
    { icon: Users, label: 'Users', href: '/dashboard/users' },
    { icon: BookOpen, label: 'Vocabulary', href: '/dashboard/vocabulary' },
  ];

  const SidebarContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
    <Flex h="full" direction="column" bg={bgColor}>
      <Flex
        h="20"
        alignItems="center"
        justifyContent={isCollapsed ? 'center' : 'space-between'}
        px={isCollapsed ? 0 : 6}
        borderBottom="1px"
        borderColor={borderColor}
      >
        {!isCollapsed && (
          <Text
            fontSize="xl"
            fontWeight="bold"
            bgGradient="linear(to-r, brand.400, brand.600)"
            bgClip="text"
          >
            IELTS Admin
          </Text>
        )}
        {isCollapsed && (
          <Text fontSize="xl" fontWeight="bold" color="brand.400">
            IA
          </Text>
        )}
      </Flex>

      <VStack spacing={2} flex={1} overflowY="auto" py={6} px={3}>
        {sidebarItems.map((item) => (
          <SidebarItem key={item.href} {...item} isCollapsed={isCollapsed} />
        ))}
      </VStack>

      <Box p={4} borderTop="1px" borderColor={borderColor}>
        <Menu>
          <MenuButton
            as={Flex}
            p={2}
            borderRadius="lg"
            cursor="pointer"
            _hover={{ bg: 'whiteAlpha.100' }}
            w="full"
            justifyContent={isCollapsed ? 'center' : 'flex-start'}
            alignItems="center"
          >
            <HStack spacing={3}>
              <Avatar size="sm" name={user?.name || 'Admin'} src={(user as any)?.avatar} />
              {!isCollapsed && (
                <Box textAlign="left">
                  <Text fontSize="sm" fontWeight="bold" color="white" isTruncated maxW="120px">
                    {user?.name || 'Admin User'}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Administrator
                  </Text>
                </Box>
              )}
            </HStack>
          </MenuButton>
          <MenuList bg="gray.800" borderColor="gray.700">
            <MenuItem
              as={Link}
              href="/dashboard/settings"
              icon={<Settings size={16} />}
              bg="gray.800"
              _hover={{ bg: 'gray.700' }}
              color="gray.200"
            >
              Settings
            </MenuItem>
            <MenuItem
              icon={<LogOut size={16} />}
              onClick={handleLogout}
              color="red.400"
              bg="gray.800"
              _hover={{ bg: 'gray.700' }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="ghost"
        icon={<MenuIcon />}
        aria-label="Open Menu"
        pos="fixed"
        top={4}
        left={4}
        zIndex={20}
        color="white"
      />

      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', md: 'block' }}
        w="64"
        pos="fixed"
        h="full"
        borderRight="1px"
        borderColor={borderColor}
        bg={bgColor}
      >
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.900">
          <DrawerCloseButton color="white" />
          <DrawerBody p={0}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
