'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      role="menuitem"
      className={`px-3 py-1.5 text-[13px] uppercase font-mono tracking-wider rounded-xl transition-all duration-200
        ${
          isActive
            ? 'text-white font-semibold bg-white/5 border border-white/10 shadow-sm'
            : 'text-white/60 font-medium hover:text-white hover:bg-white/[0.03]'
        }`}
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps {
  href?: string;
  icon: React.ReactElement;
  children: React.ReactNode;
  onClick: () => void;
  color?: string;
}

export const MobileNavLink = ({ href, icon, children, onClick, color }: MobileNavLinkProps) => {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  const content = (
    <>
      <span
        className={`shrink-0 transition-colors duration-150 ${color ? '' : isActive ? 'text-primary' : 'text-zinc-500 group-hover:text-zinc-300'}`}
      >
        {icon}
      </span>
      <span className="flex-1 text-left text-[13px] font-medium">
        {children}
      </span>
    </>
  );

  const baseClassName = `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150
    ${
      color ||
      (isActive
        ? 'text-primary bg-primary/[0.06]'
        : 'text-zinc-300 hover:bg-white/[0.04] hover:text-white')
    }`;

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={baseClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClassName} w-full cursor-pointer`}
    >
      {content}
    </button>
  );
};
