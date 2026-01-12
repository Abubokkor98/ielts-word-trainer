import { Box, Container, Text } from '@chakra-ui/react';

export function ProfileErrorState() {
  return (
    <Box bg="gray.900" py={8}>
      <Container maxW="5xl">
        <Text color="red.400">Failed to load profile data.</Text>
      </Container>
    </Box>
  );
}
