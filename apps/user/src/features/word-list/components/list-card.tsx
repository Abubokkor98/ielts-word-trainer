'use client';

import { Button, cn, Input, Popover, PopoverContent, PopoverTrigger, useToast } from '@ielts/ui';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Check,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import type { Word } from '../../vocabulary/types';
import { useDeleteList, useRemoveWord, useRenameList } from '../hooks/use-word-lists';
import type { WordList } from '../types';
import { DeleteConfirmationModal } from './delete-confirmation-modal';

// ============================================================================
// Constants & Utilities
// ============================================================================

const DIFFICULTY_DOT_COLORS: Record<string, string> = {
  beginner: 'bg-green-500',
  intermediate: 'bg-blue-500',
  advanced: 'bg-purple-500',
};

// ============================================================================
// Types
// ============================================================================

interface ListCardProps {
  list: WordList;
  onViewDetails: (word: Word) => void;
}

// ============================================================================
// Main Component
// ============================================================================

export function ListCard({ list, onViewDetails }: ListCardProps) {
  const renameList = useRenameList();
  const deleteList = useDeleteList();
  const removeWord = useRemoveWord();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(list.name);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const totalWordsCount = list.words.length;

  const onToggle = () => setIsOpen(!isOpen);
  const onDeleteOpen = () => setIsDeleteOpen(true);
  const onDeleteClose = () => setIsDeleteOpen(false);

  const handleStartRename = () => {
    setEditName(list.name);
    setIsEditing(true);
    setIsMenuOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveRename = async () => {
    const trimmedName = editName.trim();
    if (!trimmedName || trimmedName === list.name) {
      setIsEditing(false);
      return;
    }

    try {
      await renameList.mutateAsync({ listId: list._id, name: trimmedName });
      setIsEditing(false);
      toast({
        title: 'List renamed',
      });
    } catch {
      toast({
        title: 'Failed to rename list',
        variant: 'destructive',
      });
    }
  };

  const handleCancelRename = () => {
    setEditName(list.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteList.mutateAsync(list._id);
      onDeleteClose();
      toast({
        title: `"${list.name}" deleted`,
      });
    } catch {
      toast({
        title: 'Failed to delete list',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveWord = async (wordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeWord.mutateAsync({ listId: list._id, wordId });
    } catch {
      toast({
        title: 'Failed to remove word',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <motion.div
        layout
        className="glass-card rounded-[14px] w-full overflow-hidden relative flex flex-col min-h-[180px] hover:border-[rgba(255,255,255,0.15)] transition-all duration-300 cursor-pointer"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b border-border/40 relative z-10">
          {isEditing ? (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Input
                ref={inputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={(e) => {
                  const related = e.relatedTarget as HTMLElement | null;
                  if (
                    related?.getAttribute('data-action') === 'save-rename' ||
                    related?.getAttribute('data-action') === 'cancel-rename'
                  ) {
                    return;
                  }
                  handleSaveRename();
                }}
                className="h-8 max-w-[140px] bg-zinc-950 text-xs text-foreground border-zinc-800 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-lg"
              />
              <Button
                size="icon"
                variant="ghost"
                data-action="save-rename"
                onClick={handleSaveRename}
                disabled={renameList.isPending || !editName.trim()}
                className="h-7 w-7 text-green-400 hover:text-green-300 hover:bg-white/5 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Save rename"
              >
                {renameList.isPending ? (
                  <span className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
                ) : (
                  <Check size={13} className="stroke-[2.5]" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                data-action="cancel-rename"
                onClick={handleCancelRename}
                disabled={renameList.isPending}
                className="h-7 w-7 text-muted-foreground/60 hover:text-foreground hover:bg-white/5 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Cancel rename"
              >
                <X size={13} />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="flex items-center gap-2.5 flex-1 min-w-0 text-left hover:opacity-90 transition-opacity focus:outline-none"
              onClick={onToggle}
            >
              <div
                className={cn(
                  'flex-shrink-0 text-primary/80 transition-transform duration-300',
                  isOpen && 'text-primary',
                )}
              >
                <FolderOpen size={16} className="stroke-[2]" />
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <h3 className="text-sm font-bold text-foreground truncate max-w-[140px] md:max-w-[160px] group-hover/card:text-primary transition-colors">
                  {list.name}
                </h3>
              </div>
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
              {totalWordsCount} {totalWordsCount === 1 ? 'word' : 'words'}
            </span>

            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground/60 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="List actions"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <MoreHorizontal size={14} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-28 p-1 bg-zinc-950 border-border/80 rounded-xl shadow-xl z-[2000] animate-in fade-in zoom-in-95 duration-100"
                align="end"
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 w-full px-2 py-1.5 h-7 text-xs justify-start hover:bg-white/5 hover:text-foreground rounded-lg text-muted-foreground transition-colors"
                  onClick={handleStartRename}
                >
                  <Pencil size={11} />
                  Rename
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 w-full px-2 py-1.5 h-7 text-xs justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDeleteOpen();
                  }}
                >
                  <Trash2 size={11} />
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Collapsible Content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden relative z-10 flex-1"
            >
              <div className="p-4 pt-3 flex flex-col h-full justify-between gap-3">
                {list.words.length === 0 ? (
                  <div className="flex flex-col items-center justify-center border border-dashed border-border/30 rounded-[14px] py-6 px-3 text-center">
                    <BookOpen size={16} className="text-muted-foreground/30 mb-2" />
                    <span className="text-[10px] text-muted-foreground/60 leading-normal max-w-[18ch]">
                      Empty list. Save words from vocabulary to populate.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                    <AnimatePresence>
                      {list.words.map((word) => (
                        <motion.div
                          key={word._id}
                          layout
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="list-word-badge-pill group/word flex items-center justify-between gap-1.5"
                        >
                          <button
                            type="button"
                            className="flex items-center gap-1.5 focus:outline-none text-left"
                            onClick={() => onViewDetails(word)}
                          >
                            <span
                              className={cn(
                                'w-1.5 h-1.5 rounded-full flex-shrink-0',
                                DIFFICULTY_DOT_COLORS[word.difficulty] || 'bg-muted-foreground/60',
                              )}
                            />
                            <span className="truncate max-w-[85px]">{word.word}</span>
                          </button>

                          <button
                            type="button"
                            className="h-4 w-4 rounded-full flex items-center justify-center text-muted-foreground/45 hover:text-red-400 hover:bg-white/5 transition-colors focus:outline-none"
                            onClick={(e) => handleRemoveWord(word._id, e)}
                            aria-label="Remove word"
                          >
                            <X size={9} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        listName={list.name}
        isPending={deleteList.isPending}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
      />
    </>
  );
}
