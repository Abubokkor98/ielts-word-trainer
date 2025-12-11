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
  Divider,
  Box,
  Heading,
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
    pronunciation?: string;
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent bg="gray.800" borderWidth="1px" borderColor="gray.700">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.700">
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1}>
              <Heading size="xl" color="brand.400">
                {word.word}
              </Heading>
              {word.pronunciation && (
                <Text fontSize="md" color="gray.400" fontStyle="italic">
                  /{word.pronunciation}/
                </Text>
              )}
            </VStack>
            <HStack>
              {word.partOfSpeech && (
                <Badge colorScheme="blue" fontSize="sm">
                  {word.partOfSpeech}
                </Badge>
              )}
              <Badge
                colorScheme={
                  word.difficulty === 'beginner'
                    ? 'green'
                    : word.difficulty === 'intermediate'
                    ? 'orange'
                    : 'red'
                }
                fontSize="sm"
              >
                {word.difficulty}
              </Badge>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="gray.400" />

        <ModalBody py={6}>
          <VStack align="stretch" spacing={5}>
            {/* Meaning */}
            <Box>
              <Text fontWeight="600" color="gray.300" mb={2} fontSize="sm">
                MEANING
              </Text>
              <Text fontSize="md" color="gray.400">
                {word.meaning}
              </Text>
            </Box>

            <Divider borderColor="gray.700" />

            {/* Example */}
            <Box>
              <Text fontWeight="600" color="gray.300" mb={2} fontSize="sm">
                EXAMPLE SENTENCE
              </Text>
              <Text fontSize="md" fontStyle="italic" color="gray.400">
                "{word.exampleSentence}"
              </Text>
            </Box>

            {/* Synonyms */}
            {word.synonyms && word.synonyms.length > 0 && (
              <>
                <Divider borderColor="gray.700" />
                <Box>
                  <Text fontWeight="600" color="gray.300" mb={2} fontSize="sm">
                    SYNONYMS
                  </Text>
                  <HStack flexWrap="wrap" gap={2}>
                    {word.synonyms.map((syn, idx) => (
                      <Badge key={idx} colorScheme="green" fontSize="sm">
                        {syn}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              </>
            )}

            {/* Antonyms */}
            {word.antonyms && word.antonyms.length > 0 && (
              <>
                <Divider borderColor="gray.700" />
                <Box>
                  <Text fontWeight="600" color="gray.300" mb={2} fontSize="sm">
                    ANTONYMS
                  </Text>
                  <HStack flexWrap="wrap" gap={2}>
                    {word.antonyms.map((ant, idx) => (
                      <Badge key={idx} colorScheme="red" fontSize="sm">
                        {ant}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              </>
            )}

            {/* Topic */}
            {word.topic && (
              <>
                <Divider borderColor="gray.700" />
                <Box>
                  <Text fontWeight="600" color="gray.300" mb={2} fontSize="sm">
                    TOPIC
                  </Text>
                  <Badge colorScheme="blue" fontSize="md">
                    {typeof word.topic === 'object'
                      ? (word.topic as any).name
                      : word.topic}
                  </Badge>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor="gray.700">
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
