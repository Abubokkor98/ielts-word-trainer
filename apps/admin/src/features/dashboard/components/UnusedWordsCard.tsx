import { Box, Flex, Heading, Skeleton, Text } from '@chakra-ui/react';
import { Card, CardContent, CardHeader } from '@ielts/ui';
import { FileText } from 'lucide-react';
import { useUnusedWords } from '../hooks/use-vocabulary-analytics';

export const UnusedWordsCard = () => {
  const { data, isLoading, isError } = useUnusedWords(50);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Unused Words</Heading>
        </CardHeader>
        <CardContent>
          <Skeleton height="160px" borderRadius="xl" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Unused Words</Heading>
        </CardHeader>
        <CardContent>
          <Text color="red.500">Failed to load unused words</Text>
        </CardContent>
      </Card>
    );
  }

  const unusedCount = data.count;
  const hasUnusedWords = unusedCount > 0;

  return (
    <Card>
      <CardHeader>
        <Heading size="sm">Unused Words</Heading>
        <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.400' }}>
          Words with zero quiz attempts
        </Text>
      </CardHeader>
      <CardContent>
        <Box
          position="relative"
          p={8}
          bgGradient={
            hasUnusedWords
              ? 'linear(to-br, orange.500, orange.600)'
              : 'linear(to-br, green.500, green.600)'
          }
          _dark={{
            bgGradient: hasUnusedWords
              ? 'linear(to-br, orange.600, orange.800)'
              : 'linear(to-br, green.600, green.800)',
          }}
          borderRadius="xl"
          overflow="hidden"
          boxShadow="lg"
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
          <Flex direction="column" align="center" position="relative" zIndex={1}>
            <Box p={4} bg="whiteAlpha.200" borderRadius="full" mb={4} backdropFilter="blur(10px)">
              <FileText size={40} color="white" />
            </Box>

            <Text fontSize="sm" fontWeight="600" color="whiteAlpha.900" mb={2}>
              Total Unused Words
            </Text>

            <Text fontSize="5xl" fontWeight="bold" color="white" lineHeight="1" mb={4}>
              {unusedCount.toLocaleString()}
            </Text>

            <Text fontSize="sm" color="whiteAlpha.900" textAlign="center">
              {hasUnusedWords
                ? "These words haven't appeared in any quiz yet"
                : '✓ All words have been used in quizzes!'}
            </Text>
          </Flex>
        </Box>
      </CardContent>
    </Card>
  );
};
