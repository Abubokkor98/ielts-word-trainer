import {
  Button,
  Card,
  CardBody,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { QualityRating } from '../types';

interface RatingButtonsProps {
  onRating: (quality: QualityRating) => void;
  isSubmitting: boolean;
}

export function RatingButtons({ onRating, isSubmitting }: RatingButtonsProps) {
  return (
    <Card bg="gray.800" borderColor="gray.700" borderWidth="1px" w="full">
      <CardBody>
        <VStack spacing={4}>
          <Text fontWeight="semibold" color="gray.300" fontSize="lg">
            How well did you know this word?
          </Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full">
            <Button
              colorScheme="red"
              onClick={() => onRating(0)}
              size="lg"
              h="auto"
              py={4}
              flexDir="column"
              isDisabled={isSubmitting}
            >
              <Text fontWeight="bold" fontSize="lg">
                Again
              </Text>
              <Text fontSize="xs" opacity={0.8}>
                Press 1
              </Text>
              <Text fontSize="xs" opacity={0.7} mt={1}>
                {'<1d'}
              </Text>
            </Button>
            <Button
              colorScheme="orange"
              onClick={() => onRating(3)}
              size="lg"
              h="auto"
              py={4}
              flexDir="column"
              isDisabled={isSubmitting}
            >
              <Text fontWeight="bold" fontSize="lg">
                Hard
              </Text>
              <Text fontSize="xs" opacity={0.8}>
                Press 2
              </Text>
              <Text fontSize="xs" opacity={0.7} mt={1}>
                {'~1d'}
              </Text>
            </Button>
            <Button
              colorScheme="green"
              onClick={() => onRating(4)}
              size="lg"
              h="auto"
              py={4}
              flexDir="column"
              isDisabled={isSubmitting}
            >
              <Text fontWeight="bold" fontSize="lg">
                Good
              </Text>
              <Text fontSize="xs" opacity={0.8}>
                Press 3
              </Text>
              <Text fontSize="xs" opacity={0.7} mt={1}>
                {'~3d'}
              </Text>
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => onRating(5)}
              size="lg"
              h="auto"
              py={4}
              flexDir="column"
              isDisabled={isSubmitting}
            >
              <Text fontWeight="bold" fontSize="lg">
                Easy
              </Text>
              <Text fontSize="xs" opacity={0.8}>
                Press 4
              </Text>
              <Text fontSize="xs" opacity={0.7} mt={1}>
                {'~7d'}
              </Text>
            </Button>
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  );
}
