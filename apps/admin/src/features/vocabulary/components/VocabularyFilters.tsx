import { Box, HStack, Select } from '@chakra-ui/react';
import { CardHeader, Input } from '@ielts/ui';
import { Filter, Search } from 'lucide-react';
import type { ChangeEvent } from 'react';

type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

interface VocabularyFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  difficulty: Difficulty;
  onDifficultyChange: (value: Difficulty) => void;
}

export function VocabularyFilters({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
}: VocabularyFiltersProps) {
  const handleDifficultyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onDifficultyChange(e.target.value as Difficulty);
  };

  return (
    <CardHeader>
      <HStack spacing={4}>
        <Box position="relative" w="full" maxW="300px">
          <Input
            placeholder="Search words..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            pl={10}
            aria-label="Search words"
          />
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
          >
            <Search size={16} />
          </Box>
        </Box>
        <Select
          value={difficulty}
          onChange={handleDifficultyChange}
          w="180px"
          icon={<Filter size={16} />}
          aria-label="Filter by difficulty"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </Select>
      </HStack>
    </CardHeader>
  );
}
