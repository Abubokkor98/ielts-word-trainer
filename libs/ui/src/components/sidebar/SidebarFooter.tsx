'use client';

import {
  Avatar,
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSidebarTheme } from './sidebar.config';
import { useLogout } from './useLogout';

/**
 * User information interface
 * Minimal interface for what the footer needs to display
 */
export interface User {
  name?: string;
  avatar?: string;
}

export interface SidebarFooterProps {
  user: User | null;
  isCollapsed: boolean;
  onSettingsClick: () => void;
}

export const SidebarFooter = ({
  user,
  isCollapsed,
  onSettingsClick,
}: SidebarFooterProps) => {
  const theme = useSidebarTheme();
  const footerTheme = theme.footer;
  const { logout } = useLogout();

  const displayName = user?.name || 'Admin User';
  const avatar = (user as any)?.avatar;

  return (
    <Box
      p={footerTheme.padding}
      borderTop="1px"
      borderColor={footerTheme.borderColor}
    >
      <Menu>
        <MenuButton
          as={Flex}
          p={2}
          borderRadius="lg"
          cursor="pointer"
          _hover={{ bg: footerTheme.hoverBg }}
          w="full"
          justifyContent={isCollapsed ? 'center' : 'flex-start'}
          alignItems="center"
        >
          <HStack spacing={3}>
            <Avatar size="sm" name={displayName} src={avatar} />
            {!isCollapsed && (
              <Box textAlign="left">
                <Text
                  fontSize={footerTheme.userName.fontSize}
                  fontWeight={footerTheme.userName.fontWeight}
                  color={footerTheme.userName.color}
                  isTruncated
                  maxW="120px"
                >
                  {displayName}
                </Text>
                <Text
                  fontSize={footerTheme.userRole.fontSize}
                  color={footerTheme.userRole.color}
                >
                  Administrator
                </Text>
              </Box>
            )}
          </HStack>
        </MenuButton>
        <MenuList
          bg={footerTheme.menu.bg}
          borderColor={footerTheme.menu.borderColor}
        >
          <MenuItem
            as={Link}
            href="/dashboard/settings"
            icon={<Settings size={16} />}
            bg={footerTheme.menu.item.bg}
            _hover={{ bg: footerTheme.menu.item.hoverBg }}
            color={footerTheme.menu.item.color}
            onClick={onSettingsClick}
          >
            Settings
          </MenuItem>
          <MenuItem
            icon={<LogOut size={16} />}
            onClick={logout}
            color={footerTheme.menu.item.logoutColor}
            bg={footerTheme.menu.item.bg}
            _hover={{ bg: footerTheme.menu.item.hoverBg }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};
