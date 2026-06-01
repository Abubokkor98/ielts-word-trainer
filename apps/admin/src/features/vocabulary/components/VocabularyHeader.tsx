import { Button, useToast } from '@ielts/ui';
import { Plus, Upload, Loader2 } from 'lucide-react';
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
  const { toast } = useToast();
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
          variant: 'destructive',
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
          variant: 'destructive',
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
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Vocabulary Management
        </h1>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          {/* Partial Import Input */}
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          {/* Atomic Import Input */}
          <input
            type="file"
            accept=".csv"
            ref={atomicFileInputRef}
            className="hidden"
            onChange={handleAtomicFileChange}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handleImportClick}
            disabled={uploadCSV.isPending}
            className="rounded-lg px-4 border-border hover:bg-muted text-foreground"
          >
            {uploadCSV.isPending ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            Import CSV (Partial)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAtomicImportClick}
            disabled={uploadCSVAtomic.isPending}
            className="rounded-lg px-4 border-border hover:bg-muted text-foreground"
          >
            {uploadCSVAtomic.isPending ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            Import CSV (All-or-Nothing)
          </Button>

          <Button
            size="sm"
            onClick={onAdd}
            className="rounded-lg px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            <Plus size={16} className="mr-2" />
            Add Word
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Partial: Imports valid words, skips errors • All-or-Nothing: All succeed or all fail
        </p>
      </div>
    </header>
  );
}

