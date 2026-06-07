import {
  BarChart2,
  Book,
  HelpCircle,
  Home,
  LayoutDashboard,
  List,
  RotateCcw,
  User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  hasBadge?: boolean;
}

export const PUBLIC_NAV_LINKS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/vocabulary', label: 'Vocabulary', icon: Book },
  { href: '/quiz', label: 'Quiz', icon: HelpCircle },
];

// Core app links that appear in the main desktop navbar and mobile nav
export const APP_NAV_LINKS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my-lists', label: 'My Lists', icon: List },
  { href: '/review', label: 'Review', icon: RotateCcw, hasBadge: true },
];

// Profile/Account links that appear in desktop UserMenu but inline in MobileNav
export const USER_MENU_LINKS: NavItem[] = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
];
