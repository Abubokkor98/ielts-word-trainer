import { Box, Container, Skeleton, VStack } from '@chakra-ui/react';

export function ProfileSkeleton() {
  return (
    <Box bg="gray.900" py={8}>
      <Container maxW="5xl">
        <VStack spacing={8} align="stretch">
          <Skeleton height="60px" />
          <Skeleton height="400px" />
        </VStack>
      </Container>
    </Box>
  );
}
