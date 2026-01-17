import { Center, Spinner } from '@chakra-ui/react';

export function PageLoadingFallback() {
  return (
    <Center h="100vh" w="100%">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  );
}
