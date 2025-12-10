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
  useDisclosure,
  Skeleton,
} from '@chakra-ui/react';
import { Plus, FileText, CheckCircle, Clock } from 'lucide-react';
import { CreateQuizModal } from './CreateQuizModal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function QuizManagementPage() {
  const { user } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const router = useRouter();

  const { data: quizzesData, isLoading } = useQuery({
    queryKey: ['admin', 'quizzes'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/quizzes');
      return data.data; // Expected { quizzes: [], pagination: {} }
    },
    enabled: !!user && user.role === 'admin',
  });

  const handleCreate = () => {
    setEditingQuiz(null);
    onOpen();
  };

  const handleEdit = (quiz: any) => {
    setEditingQuiz(quiz);
    onOpen();
  };

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Quiz Management</Heading>
          <Button
            leftIcon={<Plus size={16} />}
            colorScheme="brand"
            onClick={handleCreate}
          >
            Create Quiz
          </Button>
        </HStack>

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="200px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
            {quizzesData?.quizzes.map((quiz: any) => (
              <Card
                key={quiz._id}
                _hover={{ shadow: 'lg' }}
                transition="shadow 0.2s"
                borderLeftWidth="4px"
                borderLeftColor={quiz.isActive ? 'green.500' : 'gray.300'}
              >
                <CardContent className="p-6">
                  <VStack align="start" spacing={4}>
                    <HStack justify="space-between" w="full">
                      <Icon as={FileText} boxSize={6} color="brand.500" />
                      <Tag colorScheme={quiz.isActive ? 'green' : 'gray'}>
                        {quiz.isActive ? 'Active' : 'Draft'}
                      </Tag>
                    </HStack>
                    <Box>
                      <Heading size="md" mb={1} noOfLines={1}>
                        {quiz.title}
                      </Heading>
                      <Text color="gray.500" fontSize="sm" noOfLines={2}>
                        {quiz.description || 'No description provided'}
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
                        <Text>{quiz.questions?.length || 0} Questions</Text>
                      </HStack>
                      <HStack fontSize="xs" color="gray.500">
                        <Clock size={14} />
                        <Text>{quiz.duration} Mins</Text>
                      </HStack>
                    </HStack>
                    <Button
                      size="sm"
                      variant="outline"
                      w="full"
                      onClick={() => handleEdit(quiz)}
                    >
                      Manage
                    </Button>
                  </VStack>
                </CardContent>
              </Card>
            ))}

            <Card
              className="border-dashed border-2 border-gray-200 flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-50"
              onClick={handleCreate}
            >
              <VStack color="gray.400">
                <Circle size="40px" bg="gray.100">
                  <Plus size={20} />
                </Circle>
                <Text fontWeight="600">Create New Quiz</Text>
              </VStack>
            </Card>
          </SimpleGrid>
        )}
      </VStack>

      {isOpen && (
        <CreateQuizModal
          isOpen={isOpen}
          onClose={onClose}
          initialData={editingQuiz}
          isEditing={!!editingQuiz}
        />
      )}
    </Box>
  );
}
