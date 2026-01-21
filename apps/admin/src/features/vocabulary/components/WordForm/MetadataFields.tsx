import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { WordFormData } from '../../types';

interface MetadataFieldsProps {
  register: UseFormRegister<WordFormData>;
  errors: FieldErrors<WordFormData>;
}

export function MetadataFields({ register, errors }: MetadataFieldsProps) {
  return (
    <>
      <FormControl isInvalid={!!errors.difficulty}>
        <FormLabel>Difficulty *</FormLabel>
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
        <FormErrorMessage>{errors.difficulty?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.partOfSpeech}>
        <FormLabel>Part of Speech *</FormLabel>
        <Input
          {...register('partOfSpeech', {
            required: 'Part of speech is required',
          })}
          placeholder="e.g. Adjective"
        />
        <FormErrorMessage>{errors.partOfSpeech?.message}</FormErrorMessage>
      </FormControl>
    </>
  );
}
