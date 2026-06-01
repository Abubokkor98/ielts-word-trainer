import { Label } from '@ielts/ui';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import type { WordFormData } from '../../types';

interface ModulesFieldProps {
  control: Control<WordFormData>;
  error?: FieldErrors<WordFormData>['modules'];
}

const AVAILABLE_MODULES: {
  id: 'reading' | 'writing' | 'listening' | 'speaking';
  label: string;
}[] = [
  { id: 'reading', label: 'Reading' },
  { id: 'writing', label: 'Writing' },
  { id: 'listening', label: 'Listening' },
  { id: 'speaking', label: 'Speaking' },
];

export function ModulesField({ control, error }: ModulesFieldProps) {
  return (
    <div className="w-full space-y-2">
      <Label className="text-sm font-semibold">Modules (Select at least one) *</Label>
      <Controller
        name="modules"
        control={control}
        rules={{
          validate: (value) =>
            value && value.length > 0 ? true : 'At least one module must be selected',
        }}
        render={({ field }) => (
          <div className="flex flex-col gap-2.5">
            {AVAILABLE_MODULES.map((mod) => {
              const isChecked = field.value?.includes(mod.id) || false;
              return (
                <label
                  key={mod.id}
                  className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, mod.id]);
                      } else {
                        field.onChange(currentValue.filter((m: string) => m !== mod.id));
                      }
                    }}
                    className="h-4 w-4 rounded border-border bg-transparent text-primary focus:ring-primary focus:ring-offset-background"
                  />
                  <span>{mod.label}</span>
                </label>
              );
            })}
          </div>
        )}
      />
      {error && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  );
}

