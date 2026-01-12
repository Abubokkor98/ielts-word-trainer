import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface ReviewCompleteProps {
  reviewedCount: number;
  onRestart: () => void;
  onReviewMore: () => void;
}

export function ReviewComplete({ reviewedCount, onRestart, onReviewMore }: ReviewCompleteProps) {
  return (
    <Box bg="gray.900" py={8} px={4}>
      <Container maxW="800px">
        <VStack spacing={6}>
          <Card bg="gray.800" borderColor="gray.700" borderWidth="1px" w="full">
            <CardBody>
              <VStack spacing={6} textAlign="center" py={8}>
                <Box fontSize="6xl">{reviewedCount === 0 ? '📚' : '🎉'}</Box>
                <Heading size="xl" color="gray.50">
                  {reviewedCount === 0 ? 'All Caught Up!' : 'Review Complete!'}
                </Heading>
                <Text color="gray.400" fontSize="lg">
                  {reviewedCount === 0
                    ? "You don't have any words due for review right now. Come back tomorrow after taking some quizzes!"
                    : `Excellent work! You reviewed ${reviewedCount} word${
                        reviewedCount > 1 ? 's' : ''
                      } today.`}
                </Text>
                <Divider borderColor="gray.700" />
                <HStack spacing={4} pt={4}>
                  <Button
                    colorScheme="brand"
                    size="lg"
                    onClick={onRestart}
                    leftIcon={<ArrowLeft size={20} />}
                  >
                    Back to Dashboard
                  </Button>
                  {reviewedCount > 0 && (
                    <Button
                      variant="outline"
                      colorScheme="brand"
                      size="lg"
                      onClick={onReviewMore}
                      leftIcon={<RotateCcw size={20} />}
                    >
                      Review More
                    </Button>
                  )}
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
