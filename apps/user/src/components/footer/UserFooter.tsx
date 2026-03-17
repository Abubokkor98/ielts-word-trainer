'use client';

import {
  Box,
  Container,
  Divider,
  Heading,
  HStack,
  Icon,
  Link as ChakraLink,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Github } from 'lucide-react';
import Link from 'next/link';
import {
  APP_NAME,
  APP_TAGLINE,
  CREATOR_NAME,
  CURRENT_YEAR,
  EXTERNAL_LINKS,
  QUICK_LINKS,
} from './footer.constants';

interface FooterLinkColumnProps {
  readonly title: string;
  readonly links: readonly { label: string; href: string }[];
}

function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <VStack align={{ base: 'center', lg: 'flex-start' }} spacing={4}>
      <Heading as="h3" size="sm" color="gray.200" letterSpacing="wider" textTransform="uppercase">
        {title}
      </Heading>
      <VStack align={{ base: 'center', lg: 'flex-start' }} spacing={2}>
        {links.map((link) => (
          <ChakraLink
            key={link.href}
            as={Link}
            href={link.href}
            color="gray.400"
            fontSize="sm"
            transition="all 0.2s"
            _hover={{ color: 'brand.400', textDecoration: 'none', transform: 'translateX(2px)' }}
          >
            {link.label}
          </ChakraLink>
        ))}
      </VStack>
    </VStack>
  );
}

export function UserFooter() {
  return (
    <Box as="footer" bg="gray.900" borderTop="1px" borderColor="gray.700" aria-label="Site footer">
      <Container maxW="7xl" py={{ base: 10, md: 14 }}>
        {/* Top Section: Brand + Link Columns */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: 8, md: 12 }} mb={10}>
          {/* Brand Column */}
          <VStack align={{ base: 'center', lg: 'flex-start' }} spacing={4}>
            <Heading as={Link} href="/" size="md" color="white" _hover={{ textDecoration: 'none' }}>
              {APP_NAME}
            </Heading>
            <Text color="gray.400" fontSize={{ base: 'sm', md: 'md' }} lineHeight="tall" maxW={{ base: '280px', md: '420px' }} textAlign={{ base: 'center', lg: 'left' }}>
              {APP_TAGLINE}
            </Text>
            {/* GitHub link in brand column */}
            <ChakraLink
              href={EXTERNAL_LINKS.github}
              isExternal
              display="inline-flex"
              alignItems="center"
              gap={2}
              color="gray.400"
              transition="all 0.2s"
              _hover={{ color: 'brand.400', textDecoration: 'none' }}
              aria-label="GitHub profile"
            >
              <Icon as={Github} boxSize={5} />
              <Text fontSize="sm">GitHub</Text>
            </ChakraLink>
          </VStack>

          {/* Quick Links Column */}
          <FooterLinkColumn title="Quick Links" links={QUICK_LINKS} />

          {/* Learning Column */}
          <VStack align={{ base: 'center', lg: 'flex-start' }} spacing={4}>
            <Heading
              as="h3"
              size="sm"
              color="gray.200"
              letterSpacing="wider"
              textTransform="uppercase"
            >
              Get Started
            </Heading>
            <VStack align={{ base: 'center', lg: 'flex-start' }} spacing={2}>
              <ChakraLink
                as={Link}
                href="/register"
                color="gray.400"
                fontSize="sm"
                transition="all 0.2s"
                _hover={{
                  color: 'brand.400',
                  textDecoration: 'none',
                  transform: 'translateX(2px)',
                }}
              >
                Create Account
              </ChakraLink>
              <ChakraLink
                as={Link}
                href="/login"
                color="gray.400"
                fontSize="sm"
                transition="all 0.2s"
                _hover={{
                  color: 'brand.400',
                  textDecoration: 'none',
                  transform: 'translateX(2px)',
                }}
              >
                Sign In
              </ChakraLink>
            </VStack>
          </VStack>
        </SimpleGrid>

        {/* Divider */}
        <Divider borderColor="gray.700" mb={6} />

        {/* Bottom Bar */}
        <HStack
          justify={{ base: 'center', lg: 'space-between' }}
          align="center"
          flexDir={{ base: 'column', lg: 'row' }}
          spacing={{ base: 3, lg: 0 }}
        >
          <Text color="gray.500" fontSize="sm">
            © {CURRENT_YEAR} {APP_NAME}. All rights reserved.
          </Text>

          <HStack spacing={1}>
            <Text color="gray.500" fontSize="sm">
              Built by
            </Text>
            <ChakraLink
              href={EXTERNAL_LINKS.portfolio}
              isExternal
              color="brand.400"
              fontSize="sm"
              fontWeight="600"
              transition="all 0.2s"
              _hover={{ color: 'brand.300', textDecoration: 'underline' }}
            >
              {CREATOR_NAME}
            </ChakraLink>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
