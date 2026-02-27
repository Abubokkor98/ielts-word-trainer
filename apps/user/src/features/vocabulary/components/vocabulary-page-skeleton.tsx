import { Box, Container, SimpleGrid, Skeleton } from '@chakra-ui/react';

const SKELETON_CARD_COUNT = 8;
const SKELETON_CARD_IDS = Array.from(
  { length: SKELETON_CARD_COUNT },
  (_, index) => `vocabulary-skeleton-${index}`
);

export function VocabularyPageSkeleton() {
  return (
    <Box bg="gray.900" py={8}>
      <Container maxW="7xl">
        <Box mb={8} textAlign={{ base: 'center', lg: 'left' }}>
          <Skeleton height="48px" width="350px" mb={2} />
          <Skeleton height="24px" width="420px" mb={6} />
          <Skeleton height="48px" borderRadius="md" />
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {SKELETON_CARD_IDS.map((id) => (
            <Skeleton key={id} height="220px" borderRadius="md" />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
