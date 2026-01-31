import { useColorModeValue } from '@chakra-ui/react';
import {
  LayoutDashboard,
  Shield,
  Users,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';

/**
 * Sidebar Navigation Items Configuration
 * Single source of truth for all sidebar navigation items
 */
export const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Shield, label: 'Admins', href: '/dashboard/admins' },
  { icon: Users, label: 'Users', href: '/dashboard/users' },
  { icon: BookOpen, label: 'Vocabulary', href: '/dashboard/vocabulary' },
  {
    icon: AlertTriangle,
    label: 'Problem Words',
    href: '/dashboard/problem-words',
  },
] as const;

export type SidebarItemConfig = (typeof sidebarItems)[number];

/**
 * Sidebar Design Tokens & Theme Configuration
 * Centralized style tokens for consistent theming across all sidebar components
 */
export const useSidebarTheme = () => {
  return {
    // Sidebar Container
    container: {
      width: {
        expanded: '64', // 256px
        collapsed: '20', // 80px
      },
      bg: useColorModeValue('white', 'gray.900'),
      borderColor: useColorModeValue('gray.200', 'gray.800'),
      transition: 'width 0.2s ease-in-out',
    },

    // Header (Logo Area)
    header: {
      height: '20', // 80px
      logoGradient: 'linear(to-r, brand.400, brand.600)',
      logoColor: useColorModeValue('brand.600', 'brand.400'),
      borderColor: useColorModeValue('gray.200', 'gray.800'),
    },

    // Navigation Items
    item: {
      // Active state
      active: {
        bg: useColorModeValue('brand.50', 'whiteAlpha.200'),
        color: useColorModeValue('brand.700', 'brand.200'),
        fontWeight: '600',
      },
      // Inactive state
      inactive: {
        color: useColorModeValue('gray.600', 'gray.400'),
        fontWeight: '500',
      },
      // Hover state
      hover: {
        bg: useColorModeValue('gray.50', 'whiteAlpha.100'),
        color: useColorModeValue('gray.900', 'white'),
      },
      // Active state (click)
      activePress: {
        bg: useColorModeValue('gray.100', 'whiteAlpha.200'),
      },
      // Spacing and sizing
      spacing: {
        px: 3,
        py: 2.5,
        mb: 1,
        iconSize: 5,
        labelMarginLeft: 3,
      },
      // Visual effects
      borderRadius: 'md',
      transition: 'all 0.2s ease-in-out',
    },

    // Footer (User Profile Area)
    footer: {
      bg: useColorModeValue('white', 'gray.900'),
      borderColor: useColorModeValue('gray.200', 'gray.800'),
      userName: {
        color: useColorModeValue('gray.900', 'white'),
        fontSize: 'sm',
        fontWeight: 'bold',
      },
      userRole: {
        color: useColorModeValue('gray.600', 'gray.400'),
        fontSize: 'xs',
      },
      menu: {
        bg: useColorModeValue('white', 'gray.800'),
        borderColor: useColorModeValue('gray.200', 'gray.700'),
        item: {
          bg: useColorModeValue('white', 'gray.800'),
          hoverBg: useColorModeValue('gray.50', 'gray.700'),
          color: useColorModeValue('gray.700', 'gray.200'),
          logoutColor: useColorModeValue('red.500', 'red.400'),
        },
      },
      hoverBg: useColorModeValue('gray.50', 'whiteAlpha.100'),
      padding: 4,
    },

    // Toggle Button
    toggle: {
      colorScheme: 'brand',
      size: 'xs',
      variant: 'solid',
      borderRadius: 'full',
      boxShadow: 'md',
      position: {
        right: '-3',
        top: '9',
      },
    },

    // Tooltip
    tooltip: {
      placement: 'right' as const,
      hasArrow: true,
      gutter: 12,
    },

    // Content Area
    content: {
      spacing: 2,
      py: 6,
      px: 3,
    },
  };
};

export type SidebarTheme = ReturnType<typeof useSidebarTheme>;
