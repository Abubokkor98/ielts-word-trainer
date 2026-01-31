import {
  Box,
  Flex,
  SimpleGrid,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Card, CardContent, CardHeader } from '@ielts/ui';
import { BookOpen, FileWarning, TrendingUp } from 'lucide-react';
import { useVocabularyOverview } from '../hooks/use-vocabulary-analytics';

export const VocabularyOverviewCard = () => {
  const { data: overview, isLoading, isError } = useVocabularyOverview();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="bold">
            Vocabulary Overview
          </Text>
        </CardHeader>
        <CardContent>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Skeleton height="140px" borderRadius="xl" />
            <Skeleton height="140px" borderRadius="xl" />
            <Skeleton height="140px" borderRadius="xl" />
          </SimpleGrid>
        </CardContent>
      </Card>
    );
  }

  if (isError || !overview) {
    return (
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="bold">
            Vocabulary Overview
          </Text>
        </CardHeader>
        <CardContent>
          <Text color="red.500">Failed to load vocabulary overview</Text>
        </CardContent>
      </Card>
    );
  }

  const kpiCards = [
    {
      label: 'Total Words',
      value: overview.totalCount.toLocaleString(),
      icon: BookOpen,
      gradient: 'linear(to-br, blue.500, blue.600)',
      darkGradient: 'linear(to-br, blue.600, blue.800)',
      tooltip: 'Total number of words across all topics and modules.',
    },
    {
      label: 'Avg Accuracy',
      value: `${overview.avgAccuracy.toFixed(1)}%`,
      icon: TrendingUp,
      gradient: 'linear(to-br, green.500, green.600)',
      darkGradient: 'linear(to-br, green.600, green.800)',
      tooltip: 'Global average accuracy across all user quiz attempts.',
    },
    {
      label: 'Unused Words',
      value: overview.unusedWordsCount.toLocaleString(),
      icon: FileWarning,
      gradient: 'linear(to-br, orange.500, orange.600)',
      darkGradient: 'linear(to-br, orange.600, orange.800)',
      tooltip: 'Words that have never been quizzed or reviewed by any user.',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <Text fontSize="lg" fontWeight="bold">
          Vocabulary Overview
        </Text>
        <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
          Key metrics at a glance
        </Text>
      </CardHeader>
      <CardContent>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <Tooltip
                key={card.label}
                label={card.tooltip}
                hasArrow
                placement="top"
              >
                <Box
                  position="relative"
                  p={6}
                  bgGradient={card.gradient}
                  _dark={{ bgGradient: card.darkGradient }}
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="lg"
                  transition="all 0.3s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '2xl',
                  }}
                  cursor="help"
                >
                  {/* Glass-morphism overlay */}
                  <Box
                    position="absolute"
                    top={0}
                    right={0}
                    bottom={0}
                    left={0}
                    bg="whiteAlpha.100"
                    backdropFilter="blur(10px)"
                    pointerEvents="none"
                  />

                  {/* Content */}
                  <Flex direction="column" position="relative" zIndex={1}>
                    <Flex align="center" justify="space-between" mb={4}>
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="whiteAlpha.900"
                      >
                        {card.label}
                      </Text>
                      <Box
                        p={2}
                        bg="whiteAlpha.200"
                        borderRadius="lg"
                        backdropFilter="blur(10px)"
                      >
                        <Icon size={20} color="white" />
                      </Box>
                    </Flex>
                    <Text
                      fontSize="4xl"
                      fontWeight="bold"
                      color="white"
                      lineHeight="1"
                    >
                      {card.value}
                    </Text>
                  </Flex>
                </Box>
              </Tooltip>
            );
          })}
        </SimpleGrid>
      </CardContent>
    </Card>
  );
};
