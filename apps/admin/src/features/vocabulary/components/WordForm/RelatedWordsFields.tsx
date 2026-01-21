import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { WordFormData } from '../../types';

interface RelatedWordsFieldsProps {
  register: UseFormRegister<WordFormData>;
  errors: FieldErrors<WordFormData>;
}

export function RelatedWordsFields({
  register,
  errors,
}: RelatedWordsFieldsProps) {
  return (
    <>
      <FormControl isInvalid={!!errors.synonyms}>
        <FormLabel>Synonyms (comma separated) *</FormLabel>
        <Input
          {...register('synonyms', {
            required: 'Synonyms are required',
          })}
          placeholder="transient, fleeting, short-lived"
        />
        <FormErrorMessage>{errors.synonyms?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.antonyms}>
        <FormLabel>Antonyms (comma separated) *</FormLabel>
        <Input
          {...register('antonyms', {
            required: 'Antonyms are required',
          })}
          placeholder="permanent, long-lived"
        />
        <FormErrorMessage>{errors.antonyms?.message}</FormErrorMessage>
      </FormControl>
    </>
  );
}
