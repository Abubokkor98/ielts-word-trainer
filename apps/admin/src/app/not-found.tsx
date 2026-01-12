'use client';

import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      _dark={{ bg: 'gray.900' }}
    >
      <Container maxW="container.md">
        <VStack spacing={8} textAlign="center">
          <Heading size="4xl" color="brand.500" _dark={{ color: 'brand.400' }}>
            404
          </Heading>

          <VStack spacing={4}>
            <Heading size="lg" color="gray.800" _dark={{ color: 'gray.100' }}>
              Page Not Found
            </Heading>
            <Text color="gray.600" _dark={{ color: 'gray.400' }} fontSize="lg">
              The resource you are looking for does not exist or has been moved.
            </Text>
          </VStack>

          <Button
            as={Link}
            href="/dashboard"
            colorScheme="brand"
            size="lg"
            _hover={{ textDecoration: 'none' }}
          >
            Return to Dashboard
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
