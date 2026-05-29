import { Button, cn, Input, Popover, PopoverContent, PopoverTrigger, useToast } from '@ielts/ui';
import { Bookmark, BookmarkCheck, Check, FolderPlus } from 'lucide-react';
import { useSaveToList } from '../hooks/use-save-to-list';
import type { WordList } from '../types';

// ============================================================================
// Types
// ============================================================================

interface SaveToListButtonProps {
  wordId: string;
  isAuthenticated?: boolean;
}

interface SaveToListHeaderProps {
  showCreateInput: boolean;
  onToggleCreateInput: () => void;
}

interface SaveToListItemsProps {
  lists: WordList[];
  listsContainingWord: Set<string>;
  isLoading: boolean;
  showCreateInput: boolean;
  onAddToList: (listId: string, listName: string) => void;
}

interface CreateListFormProps {
  newListName: string;
  isLoading: boolean;
  onChangeName: (name: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCreate: () => void;
}

// ============================================================================
// Sub-components
// ============================================================================

function SaveToListHeader({ showCreateInput, onToggleCreateInput }: SaveToListHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-card/20">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
        Save word to list
      </span>
      <button
        type="button"
        onClick={onToggleCreateInput}
        className={cn(
          'flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition-all border',
          showCreateInput
            ? 'border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10'
            : 'border-primary/20 text-primary bg-primary/5 hover:bg-primary/10',
        )}
      >
        <FolderPlus size={14} />
        {showCreateInput ? 'Cancel' : 'New List'}
      </button>
    </div>
  );
}

function SaveToListItems({
  lists,
  listsContainingWord,
  isLoading,
  showCreateInput,
  onAddToList,
}: SaveToListItemsProps) {
  if (lists.length === 0 && !showCreateInput) {
    return (
      <div className="px-4 py-8 text-center flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border text-muted-foreground mb-3">
          <FolderPlus size={18} className="stroke-[1.5]" />
        </div>
        <p className="text-sm font-semibold text-foreground">No lists yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1 max-w-[20ch]">
          Create your first list to start saving words.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-[220px] overflow-y-auto py-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
      {lists.map((list) => {
        const isInList = listsContainingWord.has(list._id);
        return (
          <button
            type="button"
            key={list._id}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-accent/40 text-left transition-colors w-full focus:outline-none focus:bg-accent/40 group"
            onClick={() => {
              if (!isLoading) {
                onAddToList(list._id, list.name);
              }
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Custom Animated Checkbox */}
              <div
                className={cn(
                  'h-4 w-4 rounded border flex items-center justify-center transition-all duration-200 flex-shrink-0',
                  isInList
                    ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-purple-500/20'
                    : 'border-zinc-700 bg-zinc-900/30 group-hover:border-zinc-500',
                )}
              >
                {isInList && <Check className="h-3 w-3 stroke-[3]" />}
              </div>

              <span
                className={cn(
                  'text-sm truncate transition-colors',
                  isInList
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground group-hover:text-zinc-200',
                )}
              >
                {list.name}
              </span>
            </div>

            {/* Word Count Pill Badge */}
            <span className="text-[10px] text-muted-foreground font-mono bg-zinc-900/80 px-2 py-0.5 rounded-full border border-border">
              {list.words.length} {list.words.length === 1 ? 'word' : 'words'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CreateListForm({
  newListName,
  isLoading,
  onChangeName,
  onKeyDown,
  onCreate,
}: CreateListFormProps) {
  return (
    <div className="px-4 py-3.5 border-t border-border bg-card/10 flex flex-col gap-2.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
        Create New List
      </span>
      <div className="flex gap-2">
        <Input
          placeholder="e.g. Essay Vocabulary"
          value={newListName}
          onChange={(e) => onChangeName(e.target.value)}
          onKeyDown={onKeyDown}
          className="bg-[#120f17] border-border text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary h-9 text-xs placeholder:text-zinc-600"
          autoFocus
        />
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3.5 flex-shrink-0 text-xs font-semibold"
          disabled={!newListName.trim() || isLoading}
          onClick={onCreate}
        >
          Create
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function SaveToListButton({ wordId, isAuthenticated = false }: SaveToListButtonProps) {
  const { toast } = useToast();
  const {
    lists,
    isOpen,
    setIsOpen,
    newListName,
    setNewListName,
    showCreateInput,
    setShowCreateInput,
    isBookmarked,
    listsContainingWord,
    isLoading,
    handleAddToList,
    handleCreateAndAdd,
    handleKeyDown,
  } = useSaveToList({ wordId, isAuthenticated });

  if (!isAuthenticated) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary flex-shrink-0"
        aria-label="Save to list"
        onClick={() => {
          toast({
            title: 'Login required',
            description: 'Please log in to save words to your lists.',
          });
        }}
      >
        <Bookmark size={18} />
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary flex-shrink-0"
          aria-label={isBookmarked ? 'Already saved' : 'Save to list'}
        >
          {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="dark w-[260px] sm:w-[280px] bg-popover border-border rounded-xl p-0 shadow-lg shadow-black/40 outline-none z-[2000]"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <SaveToListHeader
          showCreateInput={showCreateInput}
          onToggleCreateInput={() => setShowCreateInput(!showCreateInput)}
        />

        <SaveToListItems
          lists={lists}
          listsContainingWord={listsContainingWord}
          isLoading={isLoading}
          showCreateInput={showCreateInput}
          onAddToList={handleAddToList}
        />

        {showCreateInput && (
          <CreateListForm
            newListName={newListName}
            isLoading={isLoading}
            onChangeName={setNewListName}
            onKeyDown={handleKeyDown}
            onCreate={handleCreateAndAdd}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
