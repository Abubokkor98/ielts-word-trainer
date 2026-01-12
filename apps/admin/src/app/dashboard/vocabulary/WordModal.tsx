import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { axiosInstance } from '@ielts/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

// Define Interface matching backend data
interface Topic {
  _id: string;
  name: string;
}

interface Word {
  _id: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  difficulty: string;
  module: string;
  partOfSpeech: string;
  topic: Topic | string; // Can be populated object or ID string
  synonyms: string[];
  antonyms: string[];
}

interface WordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Word | null;
}

interface WordFormData {
  word: string;
  meaning: string;
  exampleSentence: string;
  difficulty: string;
  module: string;
  partOfSpeech: string;
  topic: string;
  synonyms: string;
  antonyms: string;
}

export function WordModal({ isOpen, onClose, initialData }: WordModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WordFormData>();

  const toast = useToast();
  const queryClient = useQueryClient();

  // Theme-aware colors
  const dropdownBg = useColorModeValue('white', 'gray.700');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const dropdownHoverBg = useColorModeValue('gray.100', 'gray.600');
  const dropdownTextColor = useColorModeValue('black', 'white');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');

  // Topic Autocomplete State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [userHasTyped, setUserHasTyped] = useState(false); // Track if user is actively searching
  const topicInputRef = useRef<HTMLInputElement | null>(null);

  const {
    ref: registerRef,
    onChange: registerOnChange,
    ...registerRest
  } = register('topic', { required: 'Topic is required' });
  const currentTopicValue = watch('topic');

  // Fetch Topics for Autocomplete
  const { data: topicsData, isLoading: isTopicsLoading } = useQuery({
    queryKey: ['topics', 'all'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/topics');
      return data.data as Topic[];
    },
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Filter topics based on input
  useEffect(() => {
    if (topicsData) {
      if (userHasTyped && currentTopicValue) {
        // User is typing -> Filter
        const filtered = topicsData.filter((t) =>
          t.name.toLowerCase().includes(currentTopicValue.toLowerCase()),
        );
        setFilteredTopics(filtered);
      } else {
        // User hasn't typed (fresh focus or selection) -> Show All
        setFilteredTopics(topicsData);
      }
    }
  }, [currentTopicValue, topicsData, userHasTyped]);

  const handleTopicSelect = (topicName: string) => {
    setValue('topic', topicName);
    setShowSuggestions(false);
    setUserHasTyped(false); // Reset state so next click shows full list
  };

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        let topicName = '';
        const initialTopic = initialData.topic;

        // Determine topic name
        if (typeof initialTopic === 'object' && initialTopic !== null && 'name' in initialTopic) {
          // It's a populated object
          topicName = initialTopic.name;
        } else if (typeof initialTopic === 'string') {
          // It's a string (ID or Name)
          // Try to find it in the loaded topics list by ID
          const foundTopic = topicsData?.find((t) => t._id === initialTopic);
          if (foundTopic) {
            topicName = foundTopic.name;
          } else {
            // If not found by ID, it might be the name itself (from older data or just a name string)
            topicName = initialTopic;
          }
        }

        reset({
          word: initialData.word,
          meaning: initialData.meaning,
          exampleSentence: initialData.exampleSentence,
          difficulty: initialData.difficulty,
          partOfSpeech: initialData.partOfSpeech || '',
          topic: topicName,
          module: (() => {
            if (!initialData.module) {
              console.warn(`Word ${initialData._id} missing module field, defaulting to 'reading'`);
              return 'reading';
            }
            return initialData.module;
          })(),
          synonyms: initialData.synonyms?.join(', ') || '',
          antonyms: initialData.antonyms?.join(', ') || '',
        });
      } else {
        reset({
          word: '',
          meaning: '',
          exampleSentence: '',
          difficulty: '',
          partOfSpeech: '',
          topic: '',
          module: 'reading',
          synonyms: '',
          antonyms: '',
        });
      }
    }
  }, [isOpen, initialData, reset, topicsData]);

  const mutation = useMutation({
    mutationFn: async (data: WordFormData) => {
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

      if (initialData?._id) {
        const response = await axiosInstance.patch(`/words/${initialData._id}`, payload);
        return response.data;
      } else {
        const response = await axiosInstance.post('/words', payload);
        return response.data;
      }
    },
    onSuccess: () => {
      toast({
        title: initialData ? 'Word updated successfully' : 'Word added successfully',
        status: 'success',
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
      // Invalidate topics too in case a new one was created
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast({
        title: initialData ? 'Failed to update word' : 'Failed to add word',
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
        <ModalHeader>{initialData ? 'Edit Word' : 'Add New Word'}</ModalHeader>
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
                <FormErrorMessage>{errors.word && errors.word.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.meaning} isRequired>
                <FormLabel>Meaning</FormLabel>
                <Textarea
                  {...register('meaning', { required: 'Meaning is required' })}
                  placeholder="Definition of the word"
                />
                <FormErrorMessage>{errors.meaning && errors.meaning.message}</FormErrorMessage>
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

              <FormControl isInvalid={!!errors.module} isRequired>
                <FormLabel>Module</FormLabel>
                <Select
                  {...register('module', {
                    required: 'Module is required',
                  })}
                  placeholder="Select module"
                >
                  <option value="reading">Reading</option>
                  <option value="writing">Writing</option>
                  <option value="listening">Listening</option>
                  <option value="speaking">Speaking</option>
                </Select>
                <FormErrorMessage>{errors.module && errors.module.message}</FormErrorMessage>
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

              <FormControl position="relative" isInvalid={!!errors.topic} isRequired>
                <FormLabel>Topic</FormLabel>
                <InputGroup>
                  <Input
                    {...registerRest}
                    ref={(e) => {
                      registerRef(e);
                      topicInputRef.current = e;
                    }}
                    onChange={(e) => {
                      registerOnChange(e);
                      setUserHasTyped(true);
                    }}
                    placeholder="Select or type a topic..."
                    autoComplete="off"
                    onFocus={() => {
                      setShowSuggestions(true);
                      setUserHasTyped(false);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  <InputRightElement pointerEvents="none">
                    <ChevronDown size={16} color="gray" />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.topic && errors.topic.message}</FormErrorMessage>

                {/* Topic Suggestions Dropdown */}
                {showSuggestions && (
                  <Box
                    position="absolute"
                    zIndex={1500}
                    width="100%"
                    maxH="200px"
                    overflowY="auto"
                    bg={dropdownBg}
                    border="1px solid"
                    borderColor={dropdownBorder}
                    borderRadius="md"
                    mt={1}
                    boxShadow="lg"
                  >
                    {isTopicsLoading && (
                      <Box p={2} color={dropdownTextColor}>
                        <Spinner size="sm" /> Loading topics...
                      </Box>
                    )}

                    {!isTopicsLoading && filteredTopics.length === 0 && (
                      <Box p={2} color={placeholderColor} fontSize="sm">
                        No matching topics. Type to create new.
                      </Box>
                    )}

                    <List>
                      {filteredTopics.map((topic) => (
                        <ListItem
                          key={topic._id}
                          px={4}
                          py={2}
                          cursor="pointer"
                          color={dropdownTextColor}
                          _hover={{ bg: dropdownHoverBg }}
                          onClick={() => handleTopicSelect(topic.name)}
                          transition="background 0.2s"
                        >
                          {topic.name}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.partOfSpeech} isRequired>
                <FormLabel>Part of Speech</FormLabel>
                <Input
                  {...register('partOfSpeech', {
                    required: 'Part of speech is required',
                  })}
                  placeholder="e.g. Adjective"
                />
                <FormErrorMessage>
                  {errors.partOfSpeech && errors.partOfSpeech.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.synonyms} isRequired>
                <FormLabel>Synonyms (comma separated)</FormLabel>
                <Input
                  {...register('synonyms', {
                    required: 'Synonyms are required',
                  })}
                  placeholder="transient, fleeing, short-lived"
                />
                <FormErrorMessage>{errors.synonyms && errors.synonyms.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.antonyms} isRequired>
                <FormLabel>Antonyms (comma separated)</FormLabel>
                <Input
                  {...register('antonyms', {
                    required: 'Antonyms are required',
                  })}
                  placeholder="permanent, long-lived"
                />
                <FormErrorMessage>{errors.antonyms && errors.antonyms.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" type="submit" isLoading={mutation.isPending}>
              {initialData ? 'Update Word' : 'Add Word'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
