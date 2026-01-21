import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { useWordForm } from '../hooks/useWordForm';
import { useWordMutation } from '../hooks/useWordMutation';
import {
  BasicInfoFields,
  ModulesField,
  MetadataFields,
  TopicsField,
  RelatedWordsFields,
} from './WordForm';
import type { Word, WordFormData } from '../types';

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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? 'Edit Word' : 'Add New Word'}</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
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
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={mutation.isPending}
            >
              {initialData ? 'Update Word' : 'Add Word'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
