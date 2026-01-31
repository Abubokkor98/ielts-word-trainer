'use client';

import { Box, Flex, IconButton, Text, VStack } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { sidebarItems, useSidebarTheme } from './sidebar.config';
import { SidebarFooter } from './SidebarFooter';
import { SidebarItem } from './SidebarItem';

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({ isCollapsed = false, onToggle }: SidebarProps) => {
  const theme = useSidebarTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  // Hide sidebar on login page
  if (pathname === '/login') {
    return null;
  }

  const handleSettingsClick = () => {
    router.push('/dashboard/settings');
  };

  return (
    <Box
      w={
        isCollapsed
          ? theme.container.width.collapsed
          : theme.container.width.expanded
      }
      pos="fixed"
      h="full"
      borderRight="1px"
      borderColor={theme.container.borderColor}
      bg={theme.container.bg}
      transition={theme.container.transition}
      zIndex={10}
      overflow="visible"
    >
      {/* Main Sidebar Content */}
      <Flex
        h="full"
        direction="column"
        bg={theme.container.bg}
        overflow="hidden"
      >
        {/* Header with Logo */}
        <Flex
          h={theme.header.height}
          alignItems="center"
          justifyContent={isCollapsed ? 'center' : 'space-between'}
          px={isCollapsed ? 0 : 6}
          borderBottom="1px"
          borderColor={theme.header.borderColor}
        >
          {!isCollapsed && (
            <Text
              fontSize="xl"
              fontWeight="bold"
              bgGradient={theme.header.logoGradient}
              bgClip="text"
              whiteSpace="nowrap"
            >
              IELTS Admin
            </Text>
          )}
          {isCollapsed && (
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={theme.header.logoColor}
            >
              IA
            </Text>
          )}
        </Flex>

        {/* Navigation Items */}
        <VStack
          spacing={theme.content.spacing}
          flex={1}
          overflowY="auto"
          py={theme.content.py}
          px={theme.content.px}
        >
          {sidebarItems.map((item) => {
            // Check if current route matches the sidebar item
            const isActive = pathname === item.href;
            return (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={isActive}
                isCollapsed={isCollapsed}
                showTooltip={isCollapsed}
              />
            );
          })}
        </VStack>

        {/* Footer with User Menu */}
        <SidebarFooter
          user={user}
          isCollapsed={isCollapsed}
          onSettingsClick={handleSettingsClick}
        />
      </Flex>

      {/* Toggle Button */}
      <IconButton
        aria-label="Toggle Sidebar"
        icon={
          isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
        }
        onClick={onToggle}
        pos="absolute"
        right={theme.toggle.position.right}
        top={theme.toggle.position.top}
        size={theme.toggle.size}
        variant={theme.toggle.variant}
        colorScheme={theme.toggle.colorScheme}
        borderRadius={theme.toggle.borderRadius}
        zIndex="tooltip"
        boxShadow={theme.toggle.boxShadow}
      />
    </Box>
  );
};
