import { Input, Label } from '@ielts/ui';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { WordFormData } from '../../types';

interface MetadataFieldsProps {
  register: UseFormRegister<WordFormData>;
  errors: FieldErrors<WordFormData>;
}

export function MetadataFields({ register, errors }: MetadataFieldsProps) {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="difficulty-input">Difficulty *</Label>
        <select
          id="difficulty-input"
          {...register('difficulty', {
            required: 'Difficulty is required',
          })}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.difficulty ? 'border-destructive focus-visible:ring-destructive' : ''
          }`}
        >
          <option value="">Select difficulty</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {errors.difficulty && (
          <p className="text-xs text-destructive">{errors.difficulty.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="partOfSpeech-input">Part of Speech *</Label>
        <Input
          id="partOfSpeech-input"
          {...register('partOfSpeech', {
            required: 'Part of speech is required',
          })}
          placeholder="e.g. Adjective"
          className={errors.partOfSpeech ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.partOfSpeech && (
          <p className="text-xs text-destructive">{errors.partOfSpeech.message}</p>
        )}
      </div>
    </div>
  );
}

