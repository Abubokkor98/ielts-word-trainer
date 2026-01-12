import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Progress,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { QuestionType } from '@ielts/shared';
import type { Question } from '../types';

interface QuizQuestionCardProps {
  question: Question;
  currentIdx: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswer: (id: string) => void;
}

export function QuizQuestionCard({
  question,
  currentIdx,
  totalQuestions,
  selectedAnswer,
  onAnswer,
}: QuizQuestionCardProps) {
  const progress = ((currentIdx + 1) / totalQuestions) * 100;

  const getTypeBadge = (type: QuestionType) => {
    switch (type) {
      case QuestionType.WORD_TO_MEANING:
        return { color: 'blue', text: 'Vocabulary' };
      case QuestionType.MEANING_TO_WORD:
        return { color: 'purple', text: 'Find Word' };
      case QuestionType.SYNONYM_MATCH:
        return { color: 'green', text: 'Synonym' };
      case QuestionType.ANTONYM_MATCH:
        return { color: 'orange', text: 'Antonym' };
      case QuestionType.SENTENCE_COMPLETION:
        return { color: 'pink', text: 'Fill in Blank' };
      default:
        return { color: 'gray', text: 'Question' };
    }
  };

  const badgeInfo = getTypeBadge(question.type);

  return (
    <Box bg="gray.900" py={12}>
      <Container maxW="4xl">
        <VStack spacing={8}>
          <Box w="full">
            <HStack justify="space-between" mb={2}>
              <HStack>
                <Text color="gray.400" fontSize="sm">
                  Question {currentIdx + 1}/{totalQuestions}
                </Text>
                <Badge colorScheme={badgeInfo.color} fontSize="xs">
                  {badgeInfo.text}
                </Badge>
              </HStack>
              <Badge colorScheme="brand">{Math.round(progress)}%</Badge>
            </HStack>
            <Progress value={progress} colorScheme="brand" size="sm" borderRadius="full" />
          </Box>

          <Box
            w="full"
            bg="gray.800"
            p={8}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <Heading as="h3" size="lg" color="gray.50" mb={6}>
              {question.question}
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {question.options.map((option) => (
                <Button
                  key={option.id}
                  size="lg"
                  variant={selectedAnswer === option.id ? 'default' : 'outline'}
                  colorScheme={
                    selectedAnswer === option.id
                      ? option.id === question.correctAnswer
                        ? 'green'
                        : 'red'
                      : 'gray'
                  }
                  onClick={() => onAnswer(option.id)}
                  isDisabled={selectedAnswer !== null}
                  w="full"
                  py={8}
                  textAlign="left"
                  justifyContent="flex-start"
                >
                  {option.text}
                </Button>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
