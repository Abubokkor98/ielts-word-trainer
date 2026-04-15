import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { BookOpen, BrainCircuit, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: FeatureCardProps[] = [
  {
    icon: BookOpen,
    title: '3500+ Words',
    description:
      'Comprehensive IELTS vocabulary database with meanings, examples, and usage',
  },
  {
    icon: BrainCircuit,
    title: 'Adaptive Quizzes',
    description:
      'Smart quizzes that adapt to your level and track your progress',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description:
      'Detailed performance tracking and insights to improve faster',
  },
];

export function FeaturesSection() {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} py={8}>
      {FEATURES.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </SimpleGrid>
  );
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
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
      <Box
        display="inline-flex"
        p={3}
        mb={4}
        borderRadius="xl"
        bg="whiteAlpha.100"
        color="brand.400"
      >
        <Icon size={28} strokeWidth={1.5} aria-hidden="true" focusable={false} />
      </Box>
      <Heading size="md" color="white" mb={3}>
        {title}
      </Heading>
      <Text color="gray.400">{description}</Text>
    </Box>
  );
}
