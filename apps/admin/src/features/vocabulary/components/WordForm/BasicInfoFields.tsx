import { Input, Label, Textarea } from '@ielts/ui';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { WordFormData } from '../../types';

interface BasicInfoFieldsProps {
  register: UseFormRegister<WordFormData>;
  errors: FieldErrors<WordFormData>;
}

export function BasicInfoFields({ register, errors }: BasicInfoFieldsProps) {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="word-input">Word *</Label>
        <Input
          id="word-input"
          {...register('word', { required: 'Word is required' })}
          placeholder="e.g. Ephemeral"
          className={errors.word ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.word && (
          <p className="text-xs text-destructive">{errors.word.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="meaning-input">Meaning *</Label>
        <Textarea
          id="meaning-input"
          {...register('meaning', { required: 'Meaning is required' })}
          placeholder="Definition of the word"
          className={errors.meaning ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.meaning && (
          <p className="text-xs text-destructive">{errors.meaning.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="exampleSentence-input">Example Sentence *</Label>
        <Textarea
          id="exampleSentence-input"
          {...register('exampleSentence', {
            required: 'Example sentence is required',
          })}
          placeholder="Use the word in a sentence"
          className={errors.exampleSentence ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.exampleSentence && (
          <p className="text-xs text-destructive">{errors.exampleSentence.message}</p>
        )}
      </div>
    </div>
  );
}

