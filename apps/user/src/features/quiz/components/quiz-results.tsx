import { Badge, Box, Button, Container, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { quizApi } from '../services/quiz.api';
import type { Question, QuestionAnswer, QuizRecommendation } from '../types';

interface QuizResultsProps {
  score: number;
  questions: Question[];
  answers: Map<number, QuestionAnswer>;
  onRestart: () => void;
}

export function QuizResults({ score, questions, answers, onRestart }: QuizResultsProps) {
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const [recommendation, setRecommendation] = useState<QuizRecommendation | null>(null);

  useEffect(() => {
    quizApi.getRecommendation().then(setRecommendation).catch(console.error);
  }, []);

  return (
    <Box bg="gray.900" py={8}>
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          <HStack justify="center" w="full">
            <Box
              bg="gray.800"
              p={8}
              borderRadius="lg"
              textAlign="center"
              transition="all 0.3s ease"
              borderWidth="1px"
              borderColor="brand.400"
              maxW="md"
              _hover={{
                transform: 'translateY(-8px)',
                bg: 'gray.750',
                boxShadow: '0 10px 30px rgba(30, 136, 229, 0.3)',
              }}
            >
              <VStack spacing={6}>
                <Text fontSize="5xl">{percentage >= 70 ? '🎉' : '📚'}</Text>
                <Heading as="h2" fontSize="3xl" color="gray.50">
                  Quiz Complete!
                </Heading>
                <VStack spacing={3}>
                  <Text fontSize="xl" fontWeight="600" color="gray.300">
                    Your Score: {score}/{questions.length}
                  </Text>
                  <Badge
                    fontSize="2xl"
                    px={6}
                    py={2}
                    colorScheme={percentage >= 70 ? 'green' : 'orange'}
                  >
                    {percentage}%
                  </Badge>
                </VStack>
                <Text fontSize="md" color="gray.400" maxW="sm">
                  {percentage >= 70
                    ? 'Excellent work! You have a strong vocabulary!'
                    : 'Keep practicing! Review the words and try again.'}
                </Text>

                {recommendation && (
                  <Box
                    bg="blue.900"
                    p={3}
                    borderRadius="md"
                    mt={2}
                    borderColor="blue.500"
                    borderWidth={1}
                  >
                    <Text color="blue.200" fontWeight="bold" fontSize="sm">
                      💡 Recommendation
                    </Text>
                    <Text color="white" fontSize="sm">
                      {recommendation.reason}
                    </Text>
                  </Box>
                )}

                <Button size="lg" onClick={onRestart} px={10} py={6} mt={4}>
                  Take Another Quiz
                </Button>
              </VStack>
            </Box>
          </HStack>

          <Box>
            <Heading as="h3" size="lg" color="gray.50" mb={6}>
              📚 Word Review & Explanations
            </Heading>
            <VStack spacing={4} align="stretch">
              {questions.map((question, idx) => {
                const userAnswer = answers.get(idx);
                const isCorrect = userAnswer?.isCorrect || false;
                const wordDetails = question.wordDetails;

                if (!wordDetails) return null;

                return (
                  <Box
                    key={idx}
                    bg="gray.800"
                    p={6}
                    borderRadius="lg"
                    borderWidth={2}
                    borderColor={isCorrect ? 'green.500' : 'red.500'}
                  >
                    <HStack justify="space-between" mb={4}>
                      <VStack align="start" spacing={1}>
                        <HStack>
                          <Text fontSize="sm" fontWeight="bold" color="gray.400">
                            Q{idx + 1}
                          </Text>
                          <Badge colorScheme={isCorrect ? 'green' : 'red'}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </Badge>
                        </HStack>
                        <Heading size="lg" color="white">
                          {wordDetails.word}
                        </Heading>
                        <Badge colorScheme="blue" fontSize="xs">
                          {wordDetails.partOfSpeech}
                        </Badge>
                      </VStack>
                    </HStack>

                    <VStack align="stretch" spacing={3}>
                      <Box>
                        <Text color="gray.400" fontSize="sm" fontWeight="bold">
                          Meaning
                        </Text>
                        <Text color="gray.200" fontSize="md">
                          {wordDetails.meaning}
                        </Text>
                      </Box>
                      <Box>
                        <Text color="gray.400" fontSize="sm" fontWeight="bold">
                          Example
                        </Text>
                        <Text color="gray.300" fontStyle="italic">
                          "{wordDetails.exampleSentence}"
                        </Text>
                      </Box>
                      {wordDetails.synonyms && wordDetails.synonyms.length > 0 && (
                        <Box>
                          <Text color="gray.400" fontSize="sm" fontWeight="bold">
                            Synonyms
                          </Text>
                          <Text color="gray.400">{wordDetails.synonyms.join(', ')}</Text>
                        </Box>
                      )}
                      {!isCorrect && (
                        <Box mt={2} p={3} bg="red.900" borderRadius="md">
                          <Text fontSize="sm" color="red.200">
                            <strong>You selected:</strong> {userAnswer?.selected}
                          </Text>
                          <Text fontSize="sm" color="green.200" mt={1}>
                            <strong>Correct answer:</strong> {userAnswer?.correct}
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
