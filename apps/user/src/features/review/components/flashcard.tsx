import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import type { ReviewWord } from '../types';

interface FlashcardProps {
  word: ReviewWord;
  isFlipped: boolean;
  onFlip: () => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'green';
    case 'intermediate':
      return 'yellow';
    case 'advanced':
      return 'red';
    default:
      return 'gray';
  }
};

export function Flashcard({ word, isFlipped, onFlip }: FlashcardProps) {
  return (
    <Card
      bg="gray.800"
      borderColor={isFlipped ? 'brand.500' : 'gray.700'}
      borderWidth="2px"
      w="full"
      minH="450px"
      cursor={!isFlipped ? 'pointer' : 'default'}
      onClick={() => !isFlipped && onFlip()}
      transition="all 0.3s"
      _hover={{
        transform: !isFlipped ? 'translateY(-4px)' : 'none',
        borderColor: !isFlipped ? 'brand.400' : 'brand.500',
      }}
    >
      <CardHeader>
        <HStack justify="space-between">
          <Badge
            colorScheme={getDifficultyColor(word.difficulty)}
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
          >
            {word.difficulty}
          </Badge>
          {word.topic && (
            <Text fontSize="sm" color="gray.400">
              {word.topic.name}
            </Text>
          )}
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={8} justify="center" minH="320px" px={4}>
          {!isFlipped ? (
            <VStack spacing={6}>
              <Heading size="3xl" textAlign="center" color="brand.400">
                {word.word}
              </Heading>
              <VStack spacing={2}>
                <Text color="gray.500" fontSize="md">
                  Click anywhere or press
                </Text>
                <Box
                  px={4}
                  py={2}
                  bg="gray.700"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.600"
                >
                  <Text color="gray.400" fontWeight="bold">
                    SPACE
                  </Text>
                </Box>
                <Text color="gray.500" fontSize="md">
                  to reveal answer
                </Text>
              </VStack>
            </VStack>
          ) : (
            <VStack spacing={6} w="full" align="stretch">
              <Heading size="2xl" color="brand.400" textAlign="center">
                {word.word}
              </Heading>
              <Divider borderColor="gray.700" />
              <Box>
                <Text
                  fontWeight="bold"
                  mb={2}
                  color="gray.400"
                  fontSize="sm"
                  textTransform="uppercase"
                >
                  Definition
                </Text>
                <Text fontSize="xl" color="gray.50" lineHeight="tall">
                  {word.meaning}
                </Text>
              </Box>
              {word.exampleSentence && (
                <Box>
                  <Text
                    fontWeight="bold"
                    mb={2}
                    color="gray.400"
                    fontSize="sm"
                    textTransform="uppercase"
                  >
                    Example
                  </Text>
                  <Text fontSize="lg" fontStyle="italic" color="gray.300" lineHeight="tall">
                    "{word.exampleSentence}"
                  </Text>
                </Box>
              )}

              {/* Synonyms & Antonyms */}
              {((word.synonyms && word.synonyms.length > 0) ||
                (word.antonyms && word.antonyms.length > 0)) && (
                <SimpleGrid columns={2} spacing={4} mt={2}>
                  {word.synonyms && word.synonyms.length > 0 && (
                    <Box>
                      <Text
                        fontWeight="bold"
                        mb={2}
                        color="gray.400"
                        fontSize="sm"
                        textTransform="uppercase"
                      >
                        Synonyms
                      </Text>
                      <Wrap spacing={1.5}>
                        {word.synonyms.map((syn) => (
                          <WrapItem key={syn}>
                            <Badge colorScheme="green" fontSize="xs" px={2} py={0.5}>
                              {syn}
                            </Badge>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  )}

                  {word.antonyms && word.antonyms.length > 0 && (
                    <Box>
                      <Text
                        fontWeight="bold"
                        mb={2}
                        color="gray.400"
                        fontSize="sm"
                        textTransform="uppercase"
                      >
                        Antonyms
                      </Text>
                      <Wrap spacing={1.5}>
                        {word.antonyms.map((ant) => (
                          <WrapItem key={ant}>
                            <Badge colorScheme="red" fontSize="xs" px={2} py={0.5}>
                              {ant}
                            </Badge>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  )}
                </SimpleGrid>
              )}
            </VStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
