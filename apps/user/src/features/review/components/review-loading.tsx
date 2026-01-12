import { Box, Text, VStack } from '@chakra-ui/react';

export function ReviewLoading() {
  return (
    <Box bg="gray.900" display="flex" alignItems="center" justifyContent="center" flex="1">
      <VStack spacing={4}>
        <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
        <Text color="gray.400">Loading your review session...</Text>
      </VStack>
    </Box>
  );
}
