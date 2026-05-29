'use client';

import Link from 'next/link';
import * as React from 'react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

interface User {
  name: string;
  role: string;
  email?: string;
}

interface UserMenuProps {
  user: User | null | undefined;
  onLogout: () => void;
}

function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-white/5">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm">
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1 text-left transition-opacity"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block ml-1 select-none">
            <span className="text-sm font-semibold text-zinc-200">{user.name}</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-[#1b1722] border-white/10 text-zinc-200 p-1 rounded-lg z-[2000]"
      >
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="w-full cursor-pointer focus:bg-white/5 focus:text-white py-2 px-3 block rounded-md text-sm text-zinc-200 transition-colors"
          >
            Profile Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/analytics"
            className="w-full cursor-pointer focus:bg-white/5 focus:text-white py-2 px-3 block rounded-md text-sm text-zinc-200 transition-colors"
          >
            My Analytics
          </Link>
        </DropdownMenuItem>
        {user.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link
              href="/admin"
              className="w-full cursor-pointer focus:bg-white/5 focus:text-white py-2 px-3 block rounded-md text-sm text-zinc-200 transition-colors"
            >
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-white/10 my-1" />
        <DropdownMenuItem
          onClick={onLogout}
          className="w-full cursor-pointer text-red-400 focus:bg-white/5 focus:text-red-400 py-2 px-3 rounded-md text-sm transition-colors"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
