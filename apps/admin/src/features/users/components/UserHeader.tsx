import { Heading, HStack } from '@chakra-ui/react';
import { Button } from '@ielts/ui';
import { Download } from 'lucide-react';

interface UserHeaderProps {
  onExport: () => void;
}

export function UserHeader({ onExport }: UserHeaderProps) {
  return (
    <HStack justify="space-between">
      <Heading size="lg">User Management</Heading>
      <Button
        variant="outline"
        leftIcon={<Download size={16} />}
        onClick={onExport}
      >
        Export Users
      </Button>
    </HStack>
  );
}
