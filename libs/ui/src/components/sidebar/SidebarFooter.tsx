'use client';

import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useLogout } from './useLogout';

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
  const { logout } = useLogout();

  const displayName = user?.name || 'Admin User';
  const avatarUrl = user?.avatar;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <footer className="p-3 border-t border-border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center w-full p-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-8 w-8 shrink-0 rounded-md">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold rounded-md">
                  {initial}
                </AvatarFallback>
              </Avatar>
              
              {!isCollapsed && (
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate leading-tight">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight truncate">
                    Administrator
                  </p>
                </div>
              )}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56"
        >
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/settings"
              onClick={onSettingsClick}
              className="flex items-center gap-2 cursor-pointer w-full"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={logout}
            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive w-full"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </footer>
  );
}
