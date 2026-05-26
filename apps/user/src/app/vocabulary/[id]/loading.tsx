'use client';

import { Box, Container, Skeleton, SkeletonText, VStack } from '@chakra-ui/react';

export default function WordDetailSkeleton() {
  return (
    <Box bg="gray.900" minH="80vh" py={12}>
      <Container maxW="3xl">
        <Skeleton
          height="40px"
          width={{ base: '120px', sm: '150px' }}
          maxW="100%"
          mb={8}
          borderRadius="md"
          startColor="gray.800"
          endColor="gray.700"
        />

        <Box
          bg="gray.800"
          borderRadius="lg"
          p={{ base: 4, md: 8 }}
          borderWidth="1px"
          borderColor="gray.700"
          boxShadow="lg"
        >
          <VStack align="stretch" spacing={6}>
            <Skeleton
              height="48px"
              width={{ base: '100%', sm: '280px' }}
              maxW="100%"
              borderRadius="md"
              startColor="gray.700"
              endColor="gray.600"
            />
            <Skeleton
              height="20px"
              width={{ base: '100%', sm: '150px' }}
              maxW="100%"
              borderRadius="md"
              startColor="gray.700"
              endColor="gray.600"
            />
            <Skeleton
              height="1px"
              width="100%"
              my={4}
              startColor="gray.750"
              endColor="gray.700"
            />
            <SkeletonText
              noOfLines={5}
              spacing="4"
              skeletonHeight="4"
              startColor="gray.700"
              endColor="gray.600"
            />
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
