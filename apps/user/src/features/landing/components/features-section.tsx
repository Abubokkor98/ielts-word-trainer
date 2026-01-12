import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';

export function FeaturesSection() {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} py={8}>
      <FeatureCard
        icon="📚"
        title="3000+ Words"
        description="Comprehensive IELTS vocabulary database with meanings, examples, and usage"
      />
      <FeatureCard
        icon="🎯"
        title="Adaptive Quizzes"
        description="Smart quizzes that adapt to your level and track your progress"
      />
      <FeatureCard
        icon="📊"
        title="Analytics"
        description="Detailed performance tracking and insights to improve faster"
      />
    </SimpleGrid>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Box
      bg="gray.800"
      p={6}
      borderRadius="lg"
      textAlign="center"
      cursor="pointer"
      transition="all 0.3s ease"
      borderWidth="1px"
      borderColor="transparent"
      _hover={{
        transform: 'translateY(-8px)',
        bg: 'gray.750',
        borderColor: 'brand.400',
        boxShadow: '0 10px 30px rgba(30, 136, 229, 0.3)',
      }}
    >
      <Text fontSize="4xl" mb={4}>
        {icon}
      </Text>
      <Heading size="md" color="white" mb={3}>
        {title}
      </Heading>
      <Text color="gray.400">{description}</Text>
    </Box>
  );
}
