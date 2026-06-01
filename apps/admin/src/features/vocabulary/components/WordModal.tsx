import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ielts/ui';
import { useWordForm } from '../hooks/useWordForm';
import { useWordMutation } from '../hooks/useWordMutation';
import type { Word, WordFormData } from '../types';
import {
  BasicInfoFields,
  MetadataFields,
  ModulesField,
  RelatedWordsFields,
  TopicsField,
} from './WordForm';

interface WordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Word | null;
}

export function WordModal({ isOpen, onClose, initialData }: WordModalProps) {
  // Form management with custom hook
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useWordForm({ isOpen, initialData });

  // API mutation with custom hook
  const mutation = useWordMutation({ initialData, onSuccess: onClose });

  const onSubmit = (data: WordFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-0 shadow-xl">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="text-xl font-bold text-foreground">
            {initialData ? 'Edit Word' : 'Add New Word'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="p-6 space-y-6">
            <BasicInfoFields register={register} errors={errors} />

            <ModulesField control={control} error={errors.modules} />

            <MetadataFields register={register} errors={errors} />

            <TopicsField
              control={control}
              error={errors.topics}
              isOpen={isOpen}
              setValue={setValue}
              watch={watch}
            />

            <RelatedWordsFields register={register} errors={errors} />
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : initialData ? 'Update Word' : 'Add Word'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

