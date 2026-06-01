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
