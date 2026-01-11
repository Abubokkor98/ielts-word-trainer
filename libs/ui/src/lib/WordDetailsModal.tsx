'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Badge,
  VStack,
  HStack,
  Text,
  Box,
  Heading,
  SimpleGrid,
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
    topic?: string;
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
            <Heading size="lg" color="brand.400">
              {word.word}
            </Heading>
            <HStack spacing={2}>
              {word.partOfSpeech && (
                <Badge
                  colorScheme="blue"
                  fontSize="xs"
                  textTransform="uppercase"
                >
                  {word.partOfSpeech}
                </Badge>
              )}
              <Badge
                colorScheme={difficultyColorScheme}
                fontSize="xs"
                textTransform="uppercase"
              >
                {word.difficulty}
              </Badge>
              {word.topic && (
                <Badge
                  colorScheme="purple"
                  fontSize="xs"
                  textTransform="uppercase"
                >
                  {typeof word.topic === 'object'
                    ? (word.topic as any).name
                    : word.topic}
                </Badge>
              )}
            </HStack>
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
                      {word.synonyms.map((syn, idx) => (
                        <WrapItem key={idx}>
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
                      {word.antonyms.map((ant, idx) => (
                        <WrapItem key={idx}>
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
