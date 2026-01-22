import { Box, Flex, Heading, Skeleton, Text } from '@chakra-ui/react';
import { Card, CardContent, CardHeader } from '@ielts/ui';
import { useVocabularyOverview } from '../hooks/use-vocabulary-analytics';

export const ModuleDistributionChart = () => {
  const { data: overview, isLoading, isError } = useVocabularyOverview();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Words by Module</Heading>
        </CardHeader>
        <CardContent>
          <Skeleton height="280px" w="full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !overview) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Words by Module</Heading>
        </CardHeader>
        <CardContent>
          <Text color="red.500">Failed to load module distribution</Text>
        </CardContent>
      </Card>
    );
  }

  const { byModule } = overview;

  const modules = [
    {
      name: 'Reading',
      count: byModule.reading,
      color: 'blue.500',
      lightColor: 'blue.100',
      darkColor: 'blue.700',
    },
    {
      name: 'Writing',
      count: byModule.writing,
      color: 'green.500',
      lightColor: 'green.100',
      darkColor: 'green.700',
    },
    {
      name: 'Listening',
      count: byModule.listening,
      color: 'purple.500',
      lightColor: 'purple.100',
      darkColor: 'purple.700',
    },
    {
      name: 'Speaking',
      count: byModule.speaking,
      color: 'orange.500',
      lightColor: 'orange.100',
      darkColor: 'orange.700',
    },
  ];

  const total = modules.reduce((sum, m) => sum + m.count, 0);

  return (
    <Card>
      <CardHeader>
        <Heading size="sm" mb={1}>
          Words by Module
        </Heading>
        <Text fontSize="xs" color="gray.500">
          Distribution across IELTS modules
        </Text>
      </CardHeader>
      <CardContent>
        <Flex direction="column" gap={4}>
          {modules.map((module) => {
            const percentage = total > 0 ? (module.count / total) * 100 : 0;
            return (
              <Box
                key={module.name}
                p={4}
                bg="gray.50"
                _dark={{ bg: 'gray.800' }}
                borderRadius="lg"
                borderLeft="4px solid"
                borderColor={module.color}
              >
                <Flex justify="space-between" align="center" mb={3}>
                  <Text fontSize="md" fontWeight="700" color="gray.900" _dark={{ color: 'white' }}>
                    {module.name}
                  </Text>
                  <Flex align="baseline" gap={2}>
                    <Text fontSize="2xl" fontWeight="bold" color={module.color}>
                      {module.count.toLocaleString()}
                    </Text>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                      ({percentage.toFixed(1)}%)
                    </Text>
                  </Flex>
                </Flex>
                <Box
                  w="full"
                  h="12px"
                  bg="gray.200"
                  _dark={{ bg: 'gray.700' }}
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box
                    h="full"
                    w={`${percentage}%`}
                    bg={module.color}
                    borderRadius="full"
                    transition="width 0.5s ease-in-out"
                    boxShadow="sm"
                  />
                </Box>
              </Box>
            );
          })}
        </Flex>
      </CardContent>
    </Card>
  );
};
