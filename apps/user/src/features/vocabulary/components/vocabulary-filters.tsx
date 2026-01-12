'use client';

import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { DifficultyLevel } from 'apps/user/src/types';
import { Search, X } from 'lucide-react';

interface VocabularyFiltersProps {
  difficulty: DifficultyLevel | 'all';
  onDifficultyChange: (diff: DifficultyLevel | 'all') => void;
  wordSearch: string;
  onWordSearchChange: (value: string) => void;
  topicSearch: string;
  onTopicSearchChange: (value: string) => void;
}

export function VocabularyFilters({
  difficulty,
  onDifficultyChange,
  wordSearch,
  onWordSearchChange,
  topicSearch,
  onTopicSearchChange,
}: VocabularyFiltersProps) {
  const levels: (DifficultyLevel | 'all')[] = [
    'all',
    'beginner',
    'intermediate',
    'advanced',
  ];

  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      justify="space-between"
      align="center"
      gap={6}
      mb={6}
    >
      <HStack
        spacing={2}
        overflowX="auto"
        w={{ base: '100%', lg: 'auto' }}
        justify={{ base: 'center', lg: 'flex-start' }}
      >
        {levels.map((level) => (
          <Button
            key={level}
            onClick={() => onDifficultyChange(level)}
            variant={difficulty === level ? 'solid' : 'outline'}
            colorScheme={difficulty === level ? 'brand' : 'gray'}
            size="sm"
            textTransform="capitalize"
          >
            {level}
          </Button>
        ))}
      </HStack>

      <HStack
        spacing={4}
        flex={1}
        justify={{ base: 'center', lg: 'flex-end' }}
        w={{ base: '100%', lg: 'auto' }}
      >
        <InputGroup size="md" maxW={{ base: '100%', sm: '250px' }}>
          <InputLeftElement pointerEvents="none">
            <Search color="gray.500" size={16} />
          </InputLeftElement>
          <Input
            placeholder="Search vocabulary..."
            bg="gray.800"
            border="1px"
            borderColor="gray.700"
            color="white"
            _focus={{
              ring: 2,
              ringColor: 'brand.500',
              borderColor: 'transparent',
            }}
            value={wordSearch}
            onChange={(e) => onWordSearchChange(e.target.value)}
          />
          {wordSearch && (
            <InputRightElement>
              <X
                size={16}
                color="gray"
                cursor="pointer"
                onClick={() => onWordSearchChange('')}
              />
            </InputRightElement>
          )}
        </InputGroup>

        <InputGroup size="md" maxW={{ base: '100%', md: '300px' }}>
          <InputLeftElement pointerEvents="none">
            <Search color="gray.500" size={16} />
          </InputLeftElement>
          <Input
            placeholder="Search topics..."
            bg="gray.800"
            border="1px"
            borderColor="gray.700"
            color="white"
            _focus={{
              ring: 2,
              ringColor: 'brand.500',
              borderColor: 'transparent',
            }}
            value={topicSearch}
            onChange={(e) => onTopicSearchChange(e.target.value)}
          />
          {topicSearch && (
            <InputRightElement>
              <X
                size={16}
                color="gray"
                cursor="pointer"
                onClick={() => onTopicSearchChange('')}
              />
            </InputRightElement>
          )}
        </InputGroup>
      </HStack>
    </Flex>
  );
}
