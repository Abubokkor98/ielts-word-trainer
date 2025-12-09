'use client';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import { Card, CardContent } from '@ielts/ui';
import {
  Box,
  Heading,
  HStack,
  VStack,
  Button,
  Text,
  SimpleGrid,
  Icon,
  Tag,
  Circle,
} from '@chakra-ui/react';
import { Plus, FileText, CheckCircle, Clock } from 'lucide-react';

export default function QuizManagementPage() {
  const { user } = useAuthStore();

  // Placeholder query - ideally fetch quiz list
  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/stats');
      return data.data;
    },
    enabled: !!user && user.role === 'admin',
  });

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Quiz Management</Heading>
          <Button leftIcon={<Plus size={16} />} colorScheme="brand">
            Create Quiz
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <VStack align="start" spacing={4}>
                <HStack justify="space-between" w="full">
                  <Icon as={FileText} boxSize={6} color="purple.500" />
                  <Tag colorScheme="green">Active</Tag>
                </HStack>
                <Box>
                  <Heading size="md" mb={1}>
                    General Vocabulary
                  </Heading>
                  <Text color="gray.500" fontSize="sm">
                    Standard vocabulary assessment
                  </Text>
                </Box>
                <HStack
                  spacing={4}
                  pt={2}
                  w="full"
                  borderTop="1px"
                  borderColor="gray.100"
                >
                  <HStack fontSize="xs" color="gray.500">
                    <CheckCircle size={14} />
                    <Text>20 Questions</Text>
                  </HStack>
                  <HStack fontSize="xs" color="gray.500">
                    <Clock size={14} />
                    <Text>15 Mins</Text>
                  </HStack>
                </HStack>
                <Button size="sm" variant="outline" w="full">
                  Manage
                </Button>
              </VStack>
            </CardContent>
          </Card>

          {/* Add more mock quizzes or map from data */}
          <Card className="border-dashed border-2 border-gray-200 flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-50">
            <VStack color="gray.400">
              <Circle size="40px" bg="gray.100">
                <Plus size={20} />
              </Circle>
              <Text fontWeight="600">Create New Quiz</Text>
            </VStack>
          </Card>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
