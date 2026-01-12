'use client';

import { Box, Link as ChakraLink } from '@chakra-ui/react';
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
    <ChakraLink
      as={Link}
      href={href}
      px={3}
      py={2}
      rounded="md"
      fontWeight={isActive ? '600' : '500'}
      color={isActive ? 'brand.400' : 'gray.300'}
      _hover={{
        textDecoration: 'none',
        bg: 'gray.800',
        color: 'white',
      }}
      role="menuitem"
    >
      {children}
    </ChakraLink>
  );
};

interface MobileNavLinkProps {
  href?: string;
  icon: React.ReactElement;
  children: React.ReactNode;
  onClick: () => void;
  color?: string;
}

export const MobileNavLink = ({
  href,
  icon,
  children,
  onClick,
  color,
}: MobileNavLinkProps) => {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  const content = (
    <>
      <Box
        fontSize="20px"
        color={color || (isActive ? 'brand.400' : 'gray.400')}
      >
        {icon}
      </Box>
      <Box flex="1">{children}</Box>
    </>
  );

  if (href) {
    return (
      <ChakraLink
        as={Link}
        href={href}
        onClick={onClick}
        display="flex"
        alignItems="center"
        gap={3}
        px={4}
        py={3}
        rounded="md"
        fontWeight={isActive ? '600' : '500'}
        color={color || (isActive ? 'brand.400' : 'gray.300')}
        _hover={{
          bg: 'gray.800',
          color: color || 'white',
          textDecoration: 'none',
        }}
        minH="48px"
        transition="all 0.2s"
      >
        {content}
      </ChakraLink>
    );
  }

  return (
    <Box
      onClick={onClick}
      display="flex"
      alignItems="center"
      gap={3}
      px={4}
      py={3}
      rounded="md"
      cursor="pointer"
      fontWeight="500"
      color={color || 'gray.300'}
      _hover={{
        bg: 'gray.800',
        color: color || 'white',
        textDecoration: 'none',
      }}
      minH="48px"
      transition="all 0.2s"
    >
      {content}
    </Box>
  );
};
