import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { WordFormData } from '../../types';

interface BasicInfoFieldsProps {
  register: UseFormRegister<WordFormData>;
  errors: FieldErrors<WordFormData>;
}

export function BasicInfoFields({ register, errors }: BasicInfoFieldsProps) {
  return (
    <>
      <FormControl isInvalid={!!errors.word}>
        <FormLabel>Word *</FormLabel>
        <Input
          {...register('word', { required: 'Word is required' })}
          placeholder="e.g. Ephemeral"
        />
        <FormErrorMessage>{errors.word?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.meaning}>
        <FormLabel>Meaning *</FormLabel>
        <Textarea
          {...register('meaning', { required: 'Meaning is required' })}
          placeholder="Definition of the word"
        />
        <FormErrorMessage>{errors.meaning?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.exampleSentence}>
        <FormLabel>Example Sentence *</FormLabel>
        <Textarea
          {...register('exampleSentence', {
            required: 'Example sentence is required',
          })}
          placeholder="Use the word in a sentence"
        />
        <FormErrorMessage>{errors.exampleSentence?.message}</FormErrorMessage>
      </FormControl>
    </>
  );
}
