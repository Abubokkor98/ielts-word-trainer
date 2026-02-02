import { Heading, HStack, Text, useToast, VStack } from '@chakra-ui/react';
import { Button } from '@ielts/ui';
import { Plus, Upload } from 'lucide-react';
import { useRef } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';

interface VocabularyHeaderProps {
  onAdd: () => void;
  uploadCSV: UseMutationResult<unknown, Error, File>;
  uploadCSVAtomic: UseMutationResult<unknown, Error, File>;
}

export function VocabularyHeader({
  onAdd,
  uploadCSV,
  uploadCSVAtomic,
}: VocabularyHeaderProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const atomicFileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleAtomicImportClick = () => {
    atomicFileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const name = file.name.toLowerCase();
      const mime = file.type.toLowerCase();
      const isCsv = name.endsWith('.csv') || mime.includes('csv');
      if (!isCsv) {
        toast({
          title: 'Please select a valid CSV file',
          status: 'error',
        });
        e.target.value = '';
        return;
      }
      uploadCSV.mutate(file, {
        onSettled: () => {
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
      });
    }
  };

  const handleAtomicFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const name = file.name.toLowerCase();
      const mime = file.type.toLowerCase();
      const isCsv = name.endsWith('.csv') || mime.includes('csv');
      if (!isCsv) {
        toast({
          title: 'Please select a valid CSV file',
          status: 'error',
        });
        e.target.value = '';
        return;
      }
      uploadCSVAtomic.mutate(file, {
        onSettled: () => {
          if (atomicFileInputRef.current) atomicFileInputRef.current.value = '';
        },
      });
    }
  };

  return (
    <HStack justify="space-between">
      <Heading size="lg">Vocabulary Management</Heading>
      <HStack spacing={3}>
        {/* Partial Import Input */}
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {/* Atomic Import Input */}
        <input
          type="file"
          accept=".csv"
          ref={atomicFileInputRef}
          style={{ display: 'none' }}
          onChange={handleAtomicFileChange}
        />

        <VStack align="stretch" spacing={2}>
          <HStack spacing={2}>
            <Button
              leftIcon={<Upload size={16} />}
              variant="outline"
              colorScheme="blue"
              size="sm"
              onClick={handleImportClick}
              isLoading={uploadCSV.isPending}
            >
              Import CSV (Partial)
            </Button>
            <Button
              leftIcon={<Upload size={16} />}
              variant="outline"
              colorScheme="purple"
              size="sm"
              onClick={handleAtomicImportClick}
              isLoading={uploadCSVAtomic.isPending}
            >
              Import CSV (All-or-Nothing)
            </Button>
            <Button
              leftIcon={<Plus size={16} />}
              colorScheme="brand"
              size="sm"
              onClick={onAdd}
            >
              Add Word
            </Button>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            Partial: Imports valid words, skips errors • All-or-Nothing: All
            succeed or all fail
          </Text>
        </VStack>
      </HStack>
    </HStack>
  );
}
