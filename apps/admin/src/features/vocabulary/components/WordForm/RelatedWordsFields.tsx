import { Input, Label } from '@ielts/ui';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { WordFormData } from '../../types';

interface RelatedWordsFieldsProps {
  register: UseFormRegister<WordFormData>;
  errors: FieldErrors<WordFormData>;
}

export function RelatedWordsFields({ register, errors }: RelatedWordsFieldsProps) {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="synonyms-input">Synonyms (comma separated) *</Label>
        <Input
          id="synonyms-input"
          {...register('synonyms', {
            required: 'Synonyms are required',
          })}
          placeholder="transient, fleeting, short-lived"
          className={errors.synonyms ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.synonyms && (
          <p className="text-xs text-destructive">{errors.synonyms.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="antonyms-input">Antonyms (comma separated) *</Label>
        <Input
          id="antonyms-input"
          {...register('antonyms', {
            required: 'Antonyms are required',
          })}
          placeholder="permanent, long-lived"
          className={errors.antonyms ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.antonyms && (
          <p className="text-xs text-destructive">{errors.antonyms.message}</p>
        )}
      </div>
    </div>
  );
}

