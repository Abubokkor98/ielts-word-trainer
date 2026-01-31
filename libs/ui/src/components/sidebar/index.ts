/**
 * Sidebar Component Module
 * Exports all sidebar-related components and utilities
 */

export { Sidebar } from './Sidebar';
export type { SidebarProps } from './Sidebar';

export { SidebarItem } from './SidebarItem';
export type { SidebarItemProps } from './SidebarItem';

export { SidebarFooter } from './SidebarFooter';
export type { SidebarFooterProps } from './SidebarFooter';

export { sidebarItems, useSidebarTheme } from './sidebar.config';
export type { SidebarItemConfig, SidebarTheme } from './sidebar.config';

export { useLogout } from './useLogout';
