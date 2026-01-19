'use client';

import {
  Badge,
  Box,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { Button } from '@ielts/ui';

interface WordDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: {
    word: string;
    meaning: string;
    exampleSentence: string;
    difficulty: string;
    partOfSpeech?: string;
    synonyms?: string[];
    antonyms?: string[];
    topics?: Array<string | { _id: string; name: string }>;
    modules?: string[];
  } | null;
}

export function WordDetailsModal({
  isOpen,
  onClose,
  word,
}: WordDetailsModalProps) {
  if (!word) return null;

  const difficultyColorScheme =
    word.difficulty === 'beginner'
      ? 'green'
      : word.difficulty === 'intermediate'
      ? 'orange'
      : 'red';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent
        bg="gray.800"
        borderWidth="1px"
        borderColor="gray.700"
        mx={{ base: 4, md: 0 }}
      >
        {/* Compact Header */}
        <ModalHeader
          pb={3}
          pt={4}
          borderBottomWidth="1px"
          borderColor="gray.700"
        >
          <VStack align="stretch" spacing={2}>
            <VStack align="start" spacing={2} w="full">
              <HStack spacing={3} align="baseline" flexWrap="wrap">
                <Heading size="2xl" color="brand.400" lineHeight="shorter">
                  {word.word}
                </Heading>
                {word.partOfSpeech && (
                  <Badge
                    colorScheme="blue"
                    variant="solid"
                    fontSize="sm"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    textTransform="uppercase"
                    alignSelf="center"
                  >
                    {word.partOfSpeech}
                  </Badge>
                )}
              </HStack>

              <Wrap spacing={2} mt={1}>
                <WrapItem>
                  <Badge
                    colorScheme={difficultyColorScheme}
                    fontSize="0.65rem"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    {word.difficulty}
                  </Badge>
                </WrapItem>
                {word.topics &&
                  word.topics.length > 0 &&
                  word.topics.slice(0, 3).map((topic) => {
                    const topicName =
                      typeof topic === 'object' && topic !== null
                        ? topic.name
                        : topic;
                    return (
                      <WrapItem key={`topic-${topicName}`}>
                        <Badge
                          colorScheme="purple"
                          variant="subtle"
                          fontSize="0.65rem"
                          px={2}
                          py={0.5}
                          borderRadius="full"
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          {topicName}
                        </Badge>
                      </WrapItem>
                    );
                  })}
                {word.topics && word.topics.length > 3 && (
                  <WrapItem>
                    <Badge
                      colorScheme="gray"
                      variant="outline"
                      fontSize="0.65rem"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      +{word.topics.length - 3} more
                    </Badge>
                  </WrapItem>
                )}
              </Wrap>
            </VStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton color="gray.400" />

        <ModalBody py={4}>
          <VStack align="stretch" spacing={4}>
            {/* Meaning */}
            <Box>
              <Text
                fontWeight="600"
                color="gray.400"
                mb={1.5}
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Meaning
              </Text>
              <Text fontSize="md" color="gray.200" lineHeight="1.6">
                {word.meaning}
              </Text>
            </Box>

            {/* Example */}
            <Box>
              <Text
                fontWeight="600"
                color="gray.400"
                mb={1.5}
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Example
              </Text>
              <Text
                fontSize="md"
                fontStyle="italic"
                color="gray.300"
                lineHeight="1.6"
              >
                "{word.exampleSentence}"
              </Text>
            </Box>

            {/* Synonyms & Antonyms - Two Column Layout */}
            {((word.synonyms && word.synonyms.length > 0) ||
              (word.antonyms && word.antonyms.length > 0)) && (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {/* Synonyms */}
                {word.synonyms && word.synonyms.length > 0 && (
                  <Box>
                    <Text
                      fontWeight="600"
                      color="gray.400"
                      mb={1.5}
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Synonyms
                    </Text>
                    <Wrap spacing={1.5}>
                      {word.synonyms.map((syn) => (
                        <WrapItem key={syn}>
                          <Badge
                            colorScheme="green"
                            fontSize="xs"
                            px={2}
                            py={0.5}
                          >
                            {syn}
                          </Badge>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                )}

                {/* Antonyms */}
                {word.antonyms && word.antonyms.length > 0 && (
                  <Box>
                    <Text
                      fontWeight="600"
                      color="gray.400"
                      mb={1.5}
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Antonyms
                    </Text>
                    <Wrap spacing={1.5}>
                      {word.antonyms.map((ant) => (
                        <WrapItem key={ant}>
                          <Badge
                            colorScheme="red"
                            fontSize="xs"
                            px={2}
                            py={0.5}
                          >
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
        </ModalBody>

        <ModalFooter pt={3} pb={4}>
          <Button onClick={onClose} size="sm" width="full">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
