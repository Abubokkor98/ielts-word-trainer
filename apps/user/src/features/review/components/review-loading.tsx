import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  HStack,
  Skeleton,
  VStack,
} from '@chakra-ui/react';

export function ReviewLoading() {
  return (
    <Box bg="gray.900" py={8} px={4}>
      <Container maxW="900px">
        <VStack spacing={6}>
          {/* Header Skeleton */}
          <Card bg="gray.800" borderColor="gray.700" borderWidth="1px" w="full">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Skeleton height="40px" width="120px" borderRadius="md" />
                  <VStack spacing={2}>
                    <Skeleton height="24px" width="150px" borderRadius="md" />
                    <Skeleton height="16px" width="100px" borderRadius="md" />
                  </VStack>
                  <Box w="120px" />
                </HStack>
                <Skeleton height="8px" borderRadius="full" />
              </VStack>
            </CardBody>
          </Card>

          {/* Flashcard Skeleton */}
          <Card
            bg="gray.800"
            borderColor="gray.700"
            borderWidth="2px"
            w="full"
            minH="450px"
          >
            <CardHeader>
              <HStack justify="space-between">
                <Skeleton height="28px" width="100px" borderRadius="full" />
                <HStack spacing={2}>
                  <Skeleton height="24px" width="80px" borderRadius="full" />
                  <Skeleton height="24px" width="80px" borderRadius="full" />
                </HStack>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={8} justify="center" minH="320px" px={4}>
                <VStack spacing={6} w="full">
                  {/* Word skeleton */}
                  <Skeleton height="60px" width="280px" borderRadius="md" />
                  {/* Helper text skeleton */}
                  <VStack spacing={2}>
                    <Skeleton height="20px" width="180px" borderRadius="md" />
                    <Skeleton height="40px" width="100px" borderRadius="md" />
                    <Skeleton height="20px" width="160px" borderRadius="md" />
                  </VStack>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
