import { Box, Button, Card, CardBody, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import type { QualityRating } from '../types';

interface RatingButtonsProps {
  onRating: (quality: QualityRating) => void;
  isSubmitting: boolean;
}

export function RatingButtons({ onRating, isSubmitting }: RatingButtonsProps) {
  const buttons = [
    {
      label: 'Forgot',
      rating: 0,
      color: 'red',
      shortcut: '1',
    },
    {
      label: 'Struggled',
      rating: 3,
      color: 'orange',
      shortcut: '2',
    },
    {
      label: 'Knew It',
      rating: 4,
      color: 'green',
      shortcut: '3',
    },
    {
      label: 'Mastered',
      rating: 5,
      color: 'blue',
      shortcut: '4',
    },
  ];

  return (
    <Card bg="gray.800" borderColor="gray.700" borderWidth="1px" w="full">
      <CardBody p={4}>
        <VStack spacing={3}>
          <Text fontWeight="medium" color="gray.400" fontSize="sm">
            How well did you know this word?
          </Text>
          <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={3} w="full">
            {buttons.map((btn) => (
              <Button
                key={btn.rating}
                colorScheme={btn.color}
                onClick={() => onRating(btn.rating as QualityRating)}
                size="lg"
                h="auto"
                py={4}
                flexDir="column"
                isDisabled={isSubmitting}
                variant="outline"
                position="relative"
                _hover={{
                  bg: `${btn.color}.500`,
                  color: 'white',
                  borderColor: `${btn.color}.500`,
                  '& .shortcut-badge': {
                    color: 'white',
                    borderColor: 'white',
                  },
                }}
                transition="all 0.2s"
              >
                <Box
                  className="shortcut-badge"
                  position="absolute"
                  top={2}
                  right={2}
                  fontSize="xs"
                  fontWeight="bold"
                  opacity={0.6}
                  border="1px solid"
                  borderColor="currentColor"
                  borderRadius="md"
                  w="20px"
                  h="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.2s"
                >
                  {btn.shortcut}
                </Box>
                <Text fontWeight="bold" fontSize="md">
                  {btn.label}
                </Text>
              </Button>
            ))}
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  );
}
