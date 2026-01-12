import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  Badge,
  HStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - IELTS Vocabs',
  description: 'The requested page could not be found.',
};

export default function NotFound() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.900"
      p={4}
      flex="1"
    >
      <Container maxW="lg">
        <Box
          bg="gray.800"
          p={8}
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.700"
          boxShadow="xl"
        >
          <VStack align="start" spacing={6}>
            <HStack justify="space-between" w="full">
              <Heading size="2xl" color="brand.400" fontFamily="mono">
                404
              </Heading>
              <Badge
                colorScheme="red"
                fontSize="md"
                px={3}
                py={1}
                borderRadius="full"
              >
                Error
              </Badge>
            </HStack>

            <Box w="full">
              <Text
                fontWeight="bold"
                color="gray.500"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
                mb={2}
              >
                Definition
              </Text>
              <Text fontSize="xl" color="white" lineHeight="tall">
                <Text as="span" fontWeight="bold" color="brand.200">
                  /four-oh-four/
                </Text>{' '}
                (noun)
                <br />
                The digital state of being entirely lost; a webpage that has
                vanished like a difficult vocabulary word during an exam.
              </Text>
            </Box>

            <Divider borderColor="gray.700" />

            <Box w="full">
              <Text
                fontWeight="bold"
                color="gray.500"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
                mb={2}
              >
                Example Sentence
              </Text>
              <Text fontSize="lg" color="gray.300" fontStyle="italic">
                "The user searched for a page, but encountered a{' '}
                <Text as="span" color="brand.300" fontWeight="semibold">
                  404
                </Text>{' '}
                and decided to learn a new word instead."
              </Text>
            </Box>

            <Link href="/vocabulary" style={{ width: '100%' }}>
              <Button
                colorScheme="brand"
                size="lg"
                w="full"
                leftIcon={<ArrowLeft size={20} />}
                mt={4}
              >
                Back to Learning
              </Button>
            </Link>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
