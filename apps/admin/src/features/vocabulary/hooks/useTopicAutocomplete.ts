import { axiosInstance } from '@ielts/auth';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { WordFormData } from '../types';

interface Topic {
  _id: string;
  name: string;
}

interface UseTopicAutocompleteProps {
  isOpen: boolean;
  setValue: UseFormSetValue<WordFormData>;
  watch: UseFormWatch<WordFormData>;
}

export function useTopicAutocomplete({ isOpen, setValue, watch }: UseTopicAutocompleteProps) {
  // Topic Autocomplete State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [userHasTyped, setUserHasTyped] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const topicInputRef = useRef<HTMLInputElement | null>(null);
  const currentTopicsValue = watch('topics');

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
      if (userHasTyped && topicInput) {
        const filtered = topicsData.filter((t) =>
          t.name.toLowerCase().includes(topicInput.toLowerCase()),
        );
        setFilteredTopics(filtered);
      } else {
        setFilteredTopics(topicsData);
      }
    }
  }, [topicInput, topicsData, userHasTyped]);

  const handleTopicSelect = (topicName: string) => {
    const currentTopics = currentTopicsValue || [];
    const trimmedTopic = topicName.trim();

    if (!trimmedTopic || currentTopics.includes(trimmedTopic)) {
      return;
    }

    setValue('topics', [...currentTopics, trimmedTopic], {
      shouldValidate: true,
    });
    setTopicInput('');
    setShowSuggestions(false);
    setUserHasTyped(false);
  };

  const handleTopicInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (topicInput.trim()) {
        handleTopicSelect(topicInput);
      }
    }
  };

  const handleRemoveTopic = (topicName: string) => {
    const currentTopics = currentTopicsValue || [];
    setValue(
      'topics',
      currentTopics.filter((t) => t !== topicName),
      { shouldValidate: true },
    );
  };

  return {
    topicInput,
    setTopicInput,
    showSuggestions,
    setShowSuggestions,
    filteredTopics,
    userHasTyped,
    setUserHasTyped,
    topicInputRef,
    currentTopicsValue,
    topicsData,
    isTopicsLoading,
    handleTopicSelect,
    handleTopicInputKeyDown,
    handleRemoveTopic,
  };
}

