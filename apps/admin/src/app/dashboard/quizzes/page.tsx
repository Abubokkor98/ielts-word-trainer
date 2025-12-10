'use client';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import { Card, CardContent } from '@ielts/ui';
import { Difficulty } from '@ielts/shared';
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
import { useState } from 'react';

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  topic: string;
  difficulty: Difficulty;
  duration: number;
  isActive: boolean;
  questions?: unknown[];
}

export default function QuizManagementPage() {
  const { user } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const {
    data: quizzesData,
    isLoading,
    isError,
  } = useQuery({
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

  const handleEdit = (quiz: Quiz) => {
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

        {isError && <Text color="red.500">Failed to load quizzes</Text>}

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="200px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
            {quizzesData?.quizzes.map((quiz: Quiz) => (
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
              border="2px dashed"
              borderColor="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
              minH="200px"
              cursor="pointer"
              _hover={{ bg: 'gray.50' }}
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
          initialData={
            editingQuiz
              ? {
                  ...editingQuiz,
                  description: editingQuiz.description || '',
                  difficulty: editingQuiz.difficulty,
                }
              : undefined
          }
          isEditing={!!editingQuiz}
        />
      )}
    </Box>
  );
}
