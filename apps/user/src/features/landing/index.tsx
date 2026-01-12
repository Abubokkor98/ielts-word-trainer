import { Box, Container, VStack } from '@chakra-ui/react';
import { HeroSection } from './components/hero-section';
import { FeaturesSection } from './components/features-section';

export function LandingContainer() {
  return (
    <Box bg="gray.900" py={16}>
      <Container maxW="7xl">
        <VStack spacing={12} align="stretch">
          <HeroSection />
          <FeaturesSection />
        </VStack>
      </Container>
    </Box>
  );
}
