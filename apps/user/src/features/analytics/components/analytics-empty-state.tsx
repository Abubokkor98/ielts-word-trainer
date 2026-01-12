import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export function AnalyticsEmptyState() {
  return (
    <Box
      bg="gray.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex="1"
      minH="50vh"
    >
      <VStack spacing={4}>
        <Text fontSize="4xl">📊</Text>
        <Heading size="lg" color="gray.50">
          No Quiz Data Yet
        </Heading>
        <Text color="gray.400">Take some quizzes to see your analytics!</Text>
      </VStack>
    </Box>
  );
}
