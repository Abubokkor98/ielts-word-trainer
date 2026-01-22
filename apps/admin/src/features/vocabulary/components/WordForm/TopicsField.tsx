import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Spinner,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from 'react-hook-form';
import { useTopicAutocomplete } from '../../hooks/useTopicAutocomplete';
import type { WordFormData } from '../../types';

interface TopicsFieldProps {
  control: Control<WordFormData>;
  error?: FieldErrors<WordFormData>['topics'];
  isOpen: boolean;
  setValue: UseFormSetValue<WordFormData>;
  watch: UseFormWatch<WordFormData>;
}

export function TopicsField({ control, error, isOpen, setValue, watch }: TopicsFieldProps) {
  const {
    topicInput,
    setTopicInput,
    showSuggestions,
    setShowSuggestions,
    filteredTopics,
    setUserHasTyped,
    topicInputRef,
    isTopicsLoading,
    handleTopicSelect,
    handleTopicInputKeyDown,
    handleRemoveTopic,
    dropdownBg,
    dropdownBorder,
    dropdownHoverBg,
    dropdownTextColor,
    placeholderColor,
  } = useTopicAutocomplete({ isOpen, setValue, watch });

  return (
    <FormControl position="relative" isInvalid={!!error}>
      <FormLabel>Topics (Select at least one) *</FormLabel>

      <Controller
        name="topics"
        control={control}
        rules={{
          validate: (value) =>
            value && value.length > 0 ? true : 'At least one topic must be selected',
        }}
        render={({ field }) => (
          <>
            {/* Display selected topics */}
            {field.value && field.value.length > 0 && (
              <Wrap mb={2}>
                {field.value.map((topicName) => (
                  <Tag key={topicName} size="md" colorScheme="brand" borderRadius="full">
                    <TagLabel>{topicName}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveTopic(topicName)} />
                  </Tag>
                ))}
              </Wrap>
            )}

            <InputGroup>
              <Input
                ref={topicInputRef}
                value={topicInput}
                onChange={(e) => {
                  setTopicInput(e.target.value);
                  setUserHasTyped(true);
                }}
                onKeyDown={handleTopicInputKeyDown}
                placeholder="Type to search and add topics... (Press Enter to add)"
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
          </>
        )}
      />
      <FormErrorMessage>{error?.message}</FormErrorMessage>

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
              No matching topics. Press Enter to add "{topicInput}"
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
  );
}
