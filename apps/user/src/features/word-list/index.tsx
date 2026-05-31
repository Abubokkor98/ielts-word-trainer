'use client';

import { Button, Input, Skeleton, useToast, WordDetailsModal } from '@ielts/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, FolderPlus, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { Word } from '../vocabulary/types';
import { ListCard } from './components/list-card';
import { SaveToListButton } from './components/save-to-list-button';
import { useCreateList, useWordLists } from './hooks/use-word-lists';
import { useAuthStore, useIsAuthenticated } from '@ielts/auth';

// ============================================================================
// Animation Variants
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 22,
    },
  },
};

// ============================================================================
// Main Component
// ============================================================================

export function WordListContainer() {
  const isAuthenticated = useIsAuthenticated();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const { data: lists = [], isLoading } = useWordLists(isAuthenticated && hasHydrated);
  const createList = useCreateList();
  const { toast } = useToast();
  
  const [newListName, setNewListName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const totalWords = lists.reduce((sum, list) => sum + list.words.length, 0);

  const handleViewDetails = (word: Word) => {
    setSelectedWord(word);
    onOpen();
  };

  const handleCreateList = async () => {
    const trimmedName = newListName.trim();
    if (!trimmedName) return;

    try {
      await createList.mutateAsync(trimmedName);
      setNewListName('');
      setShowCreateInput(false);
      toast({
        title: `"${trimmedName}" created`,
      });
    } catch {
      toast({
        title: 'Failed to create list',
        variant: 'destructive',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateList();
    }
    if (e.key === 'Escape') {
      setShowCreateInput(false);
      setNewListName('');
    }
  };

  return (
    <div className="bg-background min-h-[85vh] py-12 w-full text-foreground relative">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="flex flex-col gap-6"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-white/5 pb-5">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight select-none">
                My Lists
              </h1>
              {!isLoading && (
                <p className="text-xs text-muted-foreground/75 mt-1 font-medium">
                  {lists.length} {lists.length === 1 ? 'collection' : 'collections'} · {totalWords}{' '}
                  {totalWords === 1 ? 'word' : 'words'}
                </p>
              )}
            </div>

            <AnimatePresence mode="wait">
              {showCreateInput ? (
                <motion.div
                  key="create-input"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-2"
                >
                  <Input
                    placeholder="New list name..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={(e) => {
                      if (e.relatedTarget?.getAttribute('data-create-button') === 'true') {
                        return;
                      }
                      setShowCreateInput(false);
                      setNewListName('');
                    }}
                    className="h-8 max-w-[170px] bg-zinc-950 text-xs text-foreground border-zinc-800 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-lg"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    data-create-button="true"
                    className="h-8 rounded-lg px-3 bg-primary text-primary-foreground hover:bg-primary/95 flex gap-1.5 items-center font-bold text-xs shadow-sm transition-all"
                    disabled={!newListName.trim() || createList.isPending}
                    onClick={handleCreateList}
                  >
                    {createList.isPending ? (
                      <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-current border-t-transparent flex-shrink-0" />
                    ) : (
                      <Plus size={13} className="stroke-[2.5]" />
                    )}
                    {createList.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="create-btn" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <Button
                    size="sm"
                    className="h-8 rounded-lg px-3 bg-zinc-900 border border-border/80 hover:bg-zinc-800 text-muted-foreground hover:text-foreground flex gap-1.5 items-center text-xs font-bold transition-colors"
                    onClick={() => setShowCreateInput(true)}
                  >
                    <FolderPlus size={13} className="stroke-[2]" />
                    New List
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Simple Premium List Grid */}
          {isLoading ? (
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-44 w-full rounded-[14px] bg-zinc-900/40 border border-white/5 animate-pulse" />
              ))}
            </motion.div>
          ) : lists.length === 0 ? (
            <motion.div variants={itemVariants} className="list-empty-state max-w-md mx-auto w-full my-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-primary/80 mb-4 mx-auto">
                <BookOpen size={20} className="stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1 select-none">
                No collections yet
              </h3>
              <p className="text-xs text-muted-foreground/75 leading-relaxed max-w-[28ch] mx-auto mb-5">
                Create a vocabulary list and save words while studying.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-lg h-8 px-3.5 transition-all"
                  onClick={() => setShowCreateInput(true)}
                >
                  Create List
                </Button>
                <Link href="/vocabulary">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-zinc-900 border-border/80 hover:bg-zinc-800 text-muted-foreground hover:text-foreground text-xs font-bold rounded-lg h-8 px-3.5 transition-all"
                  >
                    <Search size={12} className="mr-1 stroke-[2]" />
                    Browse Words
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {lists.map((list) => (
                <motion.div key={list._id} variants={itemVariants}>
                  <ListCard list={list} onViewDetails={handleViewDetails} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      <WordDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        word={selectedWord}
        headerAction={<SaveToListButton wordId={selectedWord?._id ?? ''} isAuthenticated />}
      />
    </div>
  );
}
