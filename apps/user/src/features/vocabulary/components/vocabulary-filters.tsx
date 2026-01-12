'use client';

import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
} from '@chakra-ui/react';
import type { DifficultyLevel } from 'apps/user/src/types';
import { Search, X } from 'lucide-react';

interface VocabularyFiltersProps {
  difficulty: DifficultyLevel | 'all';
  onDifficultyChange: (diff: DifficultyLevel | 'all') => void;
  wordSearch: string;
  onWordSearchChange: (value: string) => void;
  topicSearch: string;
  onTopicSearchChange: (value: string) => void;
  module: 'reading' | 'writing' | 'listening' | 'speaking' | undefined;
  onModuleChange: (value: 'reading' | 'writing' | 'listening' | 'speaking' | undefined) => void;
}

export function VocabularyFilters({
  difficulty,
  onDifficultyChange,
  wordSearch,
  onWordSearchChange,
  topicSearch,
  onTopicSearchChange,
  module,
  onModuleChange,
}: VocabularyFiltersProps) {
  const levels: (DifficultyLevel | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced'];

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

      <Box
        w={{ base: '100%', lg: 'auto' }}
        flex={1}
        display={{ base: 'grid', md: 'flex' }}
        gridTemplateColumns={{ base: '35% 1fr', sm: '130px 1fr' }}
        gap={3}
        justifyContent={{ lg: 'flex-end' }}
        alignItems="center"
      >
        <Select
          placeholder="Module"
          bg="gray.800"
          border="1px"
          borderColor="gray.700"
          color="white"
          size={{ base: 'sm', md: 'md' }}
          w={{ base: '100%', md: '130px' }}
          _focus={{
            ring: 2,
            ringColor: 'brand.500',
            borderColor: 'transparent',
          }}
          value={module || ''}
          onChange={(e) => {
            const val = e.target.value;
            onModuleChange(val ? (val as any) : undefined);
          }}
          gridColumn={{ base: '1 / 2', md: 'auto' }}
        >
          <option value="reading" style={{ background: '#1a202c' }}>
            Reading
          </option>
          <option value="writing" style={{ background: '#1a202c' }}>
            Writing
          </option>
          <option value="listening" style={{ background: '#1a202c' }}>
            Listening
          </option>
          <option value="speaking" style={{ background: '#1a202c' }}>
            Speaking
          </option>
        </Select>

        <InputGroup
          size={{ base: 'sm', md: 'md' }}
          w={{ base: '100%', md: '250px' }}
          gridColumn={{ base: '2 / 3', md: 'auto' }}
        >
          <InputLeftElement pointerEvents="none">
            <Search color="gray.500" size={14} />
          </InputLeftElement>
          <Input
            placeholder="Search vocab..."
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
              <X size={14} color="gray" cursor="pointer" onClick={() => onWordSearchChange('')} />
            </InputRightElement>
          )}
        </InputGroup>

        <InputGroup
          size={{ base: 'sm', md: 'md' }}
          w={{ base: '100%', md: '250px' }}
          gridColumn={{ base: '1 / -1', md: 'auto' }}
        >
          <InputLeftElement pointerEvents="none">
            <Search color="gray.500" size={14} />
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
              <X size={14} color="gray" cursor="pointer" onClick={() => onTopicSearchChange('')} />
            </InputRightElement>
          )}
        </InputGroup>
      </Box>
    </Flex>
  );
}
