import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';

interface ReviewHeaderProps {
  currentIndex: number;
  totalCards: number;
  reviewedCount: number;
  progress: number;
  onExit: () => void;
}

export function ReviewHeader({
  currentIndex,
  totalCards,
  reviewedCount,
  progress,
  onExit,
}: ReviewHeaderProps) {
  return (
    <Card bg="gray.800" borderColor="gray.700" borderWidth="1px" w="full">
      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Button
              variant="ghost"
              colorScheme="brand"
              leftIcon={<ArrowLeft size={20} />}
              onClick={onExit}
            >
              Dashboard
            </Button>
            <VStack spacing={0}>
              <Text fontWeight="semibold" color="gray.50" fontSize="lg">
                Card {currentIndex + 1} of {totalCards}
              </Text>
              <Text fontSize="sm" color="gray.400">
                {reviewedCount} reviewed
              </Text>
            </VStack>
            <Box w="100px" /> {/* Spacer */}
          </HStack>
          <Progress
            value={progress}
            colorScheme="brand"
            size="sm"
            borderRadius="full"
            bg="gray.700"
          />
        </VStack>
      </CardBody>
    </Card>
  );
}
