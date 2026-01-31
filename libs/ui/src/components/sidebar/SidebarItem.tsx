'use client';

import { Icon, Link as ChakraLink, Text, Tooltip } from '@chakra-ui/react';
import Link from 'next/link';
import { useSidebarTheme } from './sidebar.config';

export interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  showTooltip: boolean;
}

export const SidebarItem = ({
  icon,
  label,
  href,
  isActive,
  isCollapsed,
  showTooltip,
}: SidebarItemProps) => {
  const theme = useSidebarTheme();

  const itemTheme = theme.item;

  // Determine visual state based on active prop
  const backgroundColor = isActive ? itemTheme.active.bg : 'transparent';
  const textColor = isActive
    ? itemTheme.active.color
    : itemTheme.inactive.color;
  const fontWeight = isActive
    ? itemTheme.active.fontWeight
    : itemTheme.inactive.fontWeight;

  const content = (
    <ChakraLink
      as={Link}
      href={href}
      display="flex"
      alignItems="center"
      justifyContent={isCollapsed ? 'center' : 'flex-start'}
      w="full"
      px={itemTheme.spacing.px}
      py={itemTheme.spacing.py}
      mb={itemTheme.spacing.mb}
      position="relative"
      borderRadius={itemTheme.borderRadius}
      bg={backgroundColor}
      color={textColor}
      fontWeight={fontWeight}
      transition={itemTheme.transition}
      _hover={{
        bg: isActive ? itemTheme.active.bg : itemTheme.hover.bg,
        color: isActive ? itemTheme.active.color : itemTheme.hover.color,
        textDecoration: 'none',
      }}
      _active={{
        bg: isActive ? itemTheme.active.bg : itemTheme.activePress.bg,
      }}
    >
      <Icon
        as={icon}
        boxSize={itemTheme.spacing.iconSize}
        color="currentColor" // Inherits text color
      />
      {!isCollapsed && (
        <Text ml={itemTheme.spacing.labelMarginLeft} fontSize="sm">
          {label}
        </Text>
      )}
    </ChakraLink>
  );

  // Conditionally wrap with tooltip based on showTooltip prop
  if (showTooltip) {
    return (
      <Tooltip
        label={label}
        placement={theme.tooltip.placement}
        hasArrow={theme.tooltip.hasArrow}
        gutter={theme.tooltip.gutter}
      >
        {content}
      </Tooltip>
    );
  }

  return content;
};
