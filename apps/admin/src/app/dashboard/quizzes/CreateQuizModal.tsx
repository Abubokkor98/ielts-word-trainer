import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
  FormErrorMessage,
  Switch,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
import { Difficulty } from '@ielts/shared';
import { AxiosError } from 'axios';

interface QuizFormData {
  title: string;
  description: string;
  topic: string;
  difficulty: Difficulty;
  duration: number;
  isActive: boolean;
}

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: QuizFormData & { _id?: string };
  isEditing?: boolean;
}

export function CreateQuizModal({
  isOpen,
  onClose,
  initialData,
  isEditing = false,
}: CreateQuizModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuizFormData>({
    defaultValues: initialData || {
      difficulty: Difficulty.INTERMEDIATE,
      duration: 15,
      isActive: true,
    },
  });

  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: QuizFormData) => {
      if (isEditing && initialData?._id) {
        const response = await axiosInstance.put(
          `/admin/quizzes/${initialData._id}`,
          data
        );
        return response.data;
      }
      const response = await axiosInstance.post('/admin/quizzes', data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: `Quiz ${isEditing ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'quizzes'] });
      reset();
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast({
        title: `Failed to ${isEditing ? 'update' : 'create'} quiz`,
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    },
  });

  const onSubmit = (data: QuizFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? 'Edit Quiz' : 'Create New Quiz'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.title} isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  {...register('title', { required: 'Title is required' })}
                  placeholder="e.g. Technology Vocabulary"
                />
                <FormErrorMessage>
                  {errors.title && errors.title.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register('description')}
                  placeholder="Brief description of the quiz content"
                />
              </FormControl>

              <FormControl isInvalid={!!errors.topic} isRequired>
                <FormLabel>Topic</FormLabel>
                <Input
                  {...register('topic', { required: 'Topic is required' })}
                  placeholder="e.g. Technology"
                />
                <FormErrorMessage>
                  {errors.topic && errors.topic.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.difficulty} isRequired>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  {...register('difficulty', {
                    required: 'Difficulty is required',
                  })}
                >
                  <option value={Difficulty.BEGINNER}>Beginner</option>
                  <option value={Difficulty.INTERMEDIATE}>Intermediate</option>
                  <option value={Difficulty.ADVANCED}>Advanced</option>
                </Select>
                <FormErrorMessage>
                  {errors.difficulty && errors.difficulty.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.duration} isRequired>
                <FormLabel>Duration (minutes)</FormLabel>
                <Input
                  type="number"
                  {...register('duration', {
                    required: 'Duration is required',
                    min: { value: 1, message: 'Minimum 1 minute' },
                    valueAsNumber: true,
                  })}
                />
                <FormErrorMessage>
                  {errors.duration && errors.duration.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="is-active" mb="0">
                  Active
                </FormLabel>
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      id="is-active"
                      isChecked={value}
                      onChange={onChange}
                      colorScheme="brand"
                    />
                  )}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={mutation.isPending}
            >
              {isEditing ? 'Update Quiz' : 'Create Quiz'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
