import { Box, Container, Skeleton, SimpleGrid, VStack } from '@chakra-ui/react';

export function DashboardSkeleton() {
  return (
    <Box bg="gray.900" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          <Skeleton height="60px" />
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="120px" />
            ))}
          </SimpleGrid>
          <Skeleton height="200px" />
        </VStack>
      </Container>
    </Box>
  );
}
