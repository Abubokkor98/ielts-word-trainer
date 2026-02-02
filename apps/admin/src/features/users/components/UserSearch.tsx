import { Box } from '@chakra-ui/react';
import { CardHeader, Input } from '@ielts/ui';
import { Search } from 'lucide-react';

interface UserSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function UserSearch({ search, onSearchChange }: UserSearchProps) {
  return (
    <CardHeader>
      <Box position="relative" maxW="400px">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          pl={10}
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
    </CardHeader>
  );
}
