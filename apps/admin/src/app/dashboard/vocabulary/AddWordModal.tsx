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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
import { AxiosError } from 'axios';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WordFormData {
  word: string;
  meaning: string;
  exampleSentence: string;
  difficulty: string;
  partOfSpeech: string;
  pronunciation: string;
  topic: string;
  synonyms: string;
  antonyms: string;
}

export function AddWordModal({ isOpen, onClose }: AddWordModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WordFormData>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: WordFormData) => {
      // Process comma-separated synonyms and antonyms
      const payload = {
        ...data,
        synonyms: data.synonyms
          ? data.synonyms
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          : [],
        antonyms: data.antonyms
          ? data.antonyms
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          : [],
      };
      const response = await axiosInstance.post('/admin/words', payload);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Word added successfully',
        status: 'success',
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
      reset();
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast({
        title: 'Failed to add word',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    },
  });

  const onSubmit = (data: WordFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Word</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.word} isRequired>
                <FormLabel>Word</FormLabel>
                <Input
                  {...register('word', { required: 'Word is required' })}
                  placeholder="e.g. Ephemeral"
                />
                <FormErrorMessage>
                  {errors.word && errors.word.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.meaning} isRequired>
                <FormLabel>Meaning</FormLabel>
                <Textarea
                  {...register('meaning', { required: 'Meaning is required' })}
                  placeholder="Definition of the word"
                />
                <FormErrorMessage>
                  {errors.meaning && errors.meaning.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.exampleSentence} isRequired>
                <FormLabel>Example Sentence</FormLabel>
                <Textarea
                  {...register('exampleSentence', {
                    required: 'Example sentence is required',
                  })}
                  placeholder="Use the word in a sentence"
                />
                <FormErrorMessage>
                  {errors.exampleSentence && errors.exampleSentence.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.difficulty} isRequired>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  {...register('difficulty', {
                    required: 'Difficulty is required',
                  })}
                  placeholder="Select difficulty"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
                <FormErrorMessage>
                  {errors.difficulty && errors.difficulty.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Topic</FormLabel>
                <Input {...register('topic')} placeholder="e.g. Technology" />
              </FormControl>

              <FormControl>
                <FormLabel>Part of Speech</FormLabel>
                <Input
                  {...register('partOfSpeech')}
                  placeholder="e.g. Adjective"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Pronunciation</FormLabel>
                <Input
                  {...register('pronunciation')}
                  placeholder="e.g. /əˈfem(ə)rəl/"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Synonyms (comma separated)</FormLabel>
                <Input
                  {...register('synonyms')}
                  placeholder="transient, fleeing, short-lived"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Antonyms (comma separated)</FormLabel>
                <Input
                  {...register('antonyms')}
                  placeholder="permanent, long-lived"
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
              Add Word
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
