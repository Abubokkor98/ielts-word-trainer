'use client';

import Link from 'next/link';

export interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  showTooltip: boolean;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  isCollapsed,
}: SidebarItemProps) => {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center w-full px-3 py-2.5 rounded-md transition-colors duration-200 group relative outline-none focus-visible:ring-1 focus-visible:ring-primary ${
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 font-medium'
        }`}
        title={isCollapsed ? label : undefined}
      >
        <Icon
          className={`h-4 w-4 shrink-0 mr-3 ${
            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
          }`}
        />
        
        {!isCollapsed && (
          <span className="text-sm tracking-wide">
            {label}
          </span>
        )}

        {/* Tooltip on collapsed hover */}
        {isCollapsed && (
          <div className="absolute left-14 scale-0 rounded bg-popover px-2 py-1 text-xs font-medium text-popover-foreground group-hover:scale-100 transition-transform duration-200 z-50 border border-border shadow-md whitespace-nowrap">
            {label}
          </div>
        )}
      </Link>
    </li>
  );
};
