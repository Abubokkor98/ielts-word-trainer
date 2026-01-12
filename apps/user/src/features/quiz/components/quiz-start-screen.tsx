import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

interface QuizStartScreenProps {
  onStart: () => void;
  isLoading: boolean;
  selectedDifficulty: string;
  onDifficultyChange: (diff: string) => void;
}

export function QuizStartScreen({
  onStart,
  isLoading,
  selectedDifficulty,
  onDifficultyChange,
}: QuizStartScreenProps) {
  return (
    <Box
      bg="gray.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={12}
      flex="1"
    >
      <Container maxW="2xl">
        <VStack
          spacing={8}
          bg="gray.800"
          p={12}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.700"
        >
          <Text fontSize="6xl">🎯</Text>
          <Heading as="h1" fontSize="3xl" color="gray.50" textAlign="center">
            Ready to Test Your Vocabulary?
          </Heading>
          <Text fontSize="lg" color="gray.400" textAlign="center" maxW="md">
            Challenge yourself with our interactive quiz featuring carefully
            selected IELTS vocabulary
          </Text>
          <Box w="full" maxW="md">
            <Text color="gray.300" fontWeight="600" mb={2}>
              Select Difficulty Level
            </Text>
            <select
              value={selectedDifficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                backgroundColor: '#2D3748',
                borderColor: '#4A5568',
                color: '#F7FAFC',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            >
              <option value="mixed" style={{ background: '#1A202C' }}>
                Mixed (All Levels)
              </option>
              <option value="beginner" style={{ background: '#1A202C' }}>
                Beginner
              </option>
              <option value="intermediate" style={{ background: '#1A202C' }}>
                Intermediate
              </option>
              <option value="advanced" style={{ background: '#1A202C' }}>
                Advanced
              </option>
            </select>
          </Box>
          <Button
            size="lg"
            onClick={onStart}
            isLoading={isLoading}
            loadingText="Loading questions..."
            px={12}
            py={6}
          >
            Start New Quiz
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
