import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from '@chakra-ui/react';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import type { WordFormData } from '../../types';

interface ModulesFieldProps {
  control: Control<WordFormData>;
  error?: FieldErrors<WordFormData>['modules'];
}

export function ModulesField({ control, error }: ModulesFieldProps) {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>Modules (Select at least one) *</FormLabel>
      <Controller
        name="modules"
        control={control}
        rules={{
          validate: (value) =>
            value && value.length > 0 ? true : 'At least one module must be selected',
        }}
        render={({ field }) => (
          <CheckboxGroup value={field.value} onChange={field.onChange}>
            <Stack spacing={2}>
              <Checkbox value="reading">Reading</Checkbox>
              <Checkbox value="writing">Writing</Checkbox>
              <Checkbox value="listening">Listening</Checkbox>
              <Checkbox value="speaking">Speaking</Checkbox>
            </Stack>
          </CheckboxGroup>
        )}
      />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
}
