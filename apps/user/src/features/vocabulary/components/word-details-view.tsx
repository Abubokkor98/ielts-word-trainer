'use client';

import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { PronunciationButton } from '@ielts/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { SaveToListButton } from '../../word-list/components/save-to-list-button';
import type { Word } from '../types';

interface WordDetailsViewProps {
  word: Word;
}

export function WordDetailsView({ word }: WordDetailsViewProps) {
  const { user } = useAuthStore();

  const difficultyColorScheme =
    word.difficulty === 'beginner'
      ? 'green'
      : word.difficulty === 'intermediate'
      ? 'orange'
      : 'red';

  return (
    <Box bg="gray.900" minH="80vh" py={12}>
      <Container maxW="3xl">
        <Box display="flex" justifyContent="center" mb={8}>
          <Button
            as={Link}
            href="/vocabulary"
            leftIcon={<ArrowLeft size={16} />}
            variant="ghost"
            color="gray.400"
            _hover={{ color: 'gray.100', bg: 'gray.800' }}
          >
            Back to Library
          </Button>
        </Box>

        <Box
          bg="gray.800"
          borderRadius="lg"
          p={8}
          borderWidth="1px"
          borderColor="gray.700"
          boxShadow="lg"
        >
          <HStack justify="space-between" align="start" mb={6}>
            <VStack align="stretch" spacing={2} w="full">
              <HStack spacing={3} align="center" flexWrap="wrap" mb={2}>
                <Heading as="h1" size="2xl" color="brand.400" lineHeight="shorter">
                  {word.word}
                </Heading>
                <PronunciationButton word={word.word} size="sm" />
                <SaveToListButton
                  wordId={word._id}
                  isAuthenticated={!!user}
                />
                {word.partOfSpeech && (
                  <Badge
                    colorScheme="blue"
                    variant="solid"
                    fontSize="sm"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    textTransform="uppercase"
                  >
                    {word.partOfSpeech}
                  </Badge>
                )}
              </HStack>

              <Wrap spacing={2}>
                <WrapItem>
                  <Badge
                    colorScheme={difficultyColorScheme}
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="md"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    {word.difficulty}
                  </Badge>
                </WrapItem>
                {word.topics &&
                  word.topics.length > 0 &&
                  word.topics.map((topic) => {
                    return (
                      <WrapItem key={topic._id}>
                        <Badge
                          colorScheme="purple"
                          variant="subtle"
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="full"
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          {topic.name}
                        </Badge>
                      </WrapItem>
                    );
                  })}
              </Wrap>
            </VStack>
          </HStack>

          <Divider borderColor="gray.700" mb={6} />

          <Stack spacing={6}>
            <Box>
              <Heading
                as="h2"
                size="xs"
                color="gray.400"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={2}
              >
                Definition
              </Heading>
              <Text fontSize="lg" color="gray.100">
                {word.meaning}
              </Text>
            </Box>

            <Box>
              <Heading
                as="h2"
                size="xs"
                color="gray.400"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={2}
              >
                Example Sentence
              </Heading>
              <Text fontSize="md" color="gray.300" fontStyle="italic">
                "{word.exampleSentence}"
              </Text>
            </Box>

            {/* Synonyms & Antonyms - Two Column Layout */}
            {((word.synonyms && word.synonyms.length > 0) ||
              (word.antonyms && word.antonyms.length > 0)) && (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* Synonyms */}
                {word.synonyms && word.synonyms.length > 0 && (
                  <Box>
                    <Heading
                      as="h2"
                      size="xs"
                      color="gray.400"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      mb={2}
                    >
                      Synonyms
                    </Heading>
                    <Wrap spacing={1.5}>
                      {word.synonyms.map((syn) => (
                        <WrapItem key={syn}>
                          <Badge
                            colorScheme="green"
                            fontSize="xs"
                            px={2.5}
                            py={1}
                            borderRadius="md"
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
                    <Heading
                      as="h2"
                      size="xs"
                      color="gray.400"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      mb={2}
                    >
                      Antonyms
                    </Heading>
                    <Wrap spacing={1.5}>
                      {word.antonyms.map((ant) => (
                        <WrapItem key={ant}>
                          <Badge
                            colorScheme="red"
                            fontSize="xs"
                            px={2.5}
                            py={1}
                            borderRadius="md"
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

            {word.modules && word.modules.length > 0 && (
              <Box>
                <Heading
                  as="h2"
                  size="xs"
                  color="gray.400"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={2}
                >
                  IELTS Module Focus
                </Heading>
                <Wrap spacing={2}>
                  {word.modules.map((mod) => (
                    <WrapItem key={mod}>
                      <Badge
                        colorScheme="orange"
                        variant="outline"
                        px={2.5}
                        py={1}
                        borderRadius="md"
                        textTransform="capitalize"
                      >
                        {mod}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
