'use client';

import {
  Button,
  cn,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ielts/ui';
import type { DifficultyLevel } from 'apps/user/src/types';
import { Search, X } from 'lucide-react';

interface VocabularyFiltersProps {
  difficulty: DifficultyLevel | 'all';
  onDifficultyChange: (diff: DifficultyLevel | 'all') => void;
  wordSearch: string;
  onWordSearchChange: (value: string) => void;
  topicSearch: string;
  onTopicSearchChange: (value: string) => void;
  module: 'reading' | 'writing' | 'listening' | 'speaking' | undefined;
  onModuleChange: (value: 'reading' | 'writing' | 'listening' | 'speaking' | undefined) => void;
}

export function VocabularyFilters({
  difficulty,
  onDifficultyChange,
  wordSearch,
  onWordSearchChange,
  topicSearch,
  onTopicSearchChange,
  module,
  onModuleChange,
}: VocabularyFiltersProps) {
  const levels: (DifficultyLevel | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <section
      className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-6 w-full"
      aria-label="Filters"
    >
      {/* Difficulty Tabs */}
      <nav
        className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto justify-start pb-2 lg:pb-0 scrollbar-none"
        aria-label="Difficulty Levels"
      >
        {levels.map((level) => (
          <Button
            key={level}
            onClick={() => onDifficultyChange(level)}
            variant={difficulty === level ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'capitalize min-w-[80px] transition-all',
              difficulty === level
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent font-semibold shadow-sm shadow-purple-500/10'
                : 'bg-card/50 border-border text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            {level}
          </Button>
        ))}
      </nav>

      {/* Inputs and Select */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full lg:w-auto flex-1 flex flex-col sm:flex-row gap-3 justify-end items-center"
      >
        {/* Module Select */}
        <div className="w-full sm:w-[140px]">
          <Select
            value={module || 'all'}
            onValueChange={(val) => {
              onModuleChange(
                val === 'all'
                  ? undefined
                  : (val as 'reading' | 'writing' | 'listening' | 'speaking'),
              );
            }}
          >
            <SelectTrigger className="w-full bg-card/50 border-border text-foreground focus:ring-1 focus:ring-ring focus:ring-offset-0 focus:border-primary">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent className="dark bg-popover border-border text-popover-foreground">
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="reading">Reading</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="listening">Listening</SelectItem>
              <SelectItem value="speaking">Speaking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Word Search */}
        <div className="relative w-full sm:w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
          <Input
            placeholder="Search vocab..."
            className="pl-9 pr-9 bg-card/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary"
            value={wordSearch}
            onChange={(e) => onWordSearchChange(e.target.value)}
          />
          {wordSearch && (
            <button
              type="button"
              onClick={() => onWordSearchChange('')}
              aria-label="Clear word search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Topic Search */}
        <div className="relative w-full sm:w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
          <Input
            placeholder="Search topics..."
            className="pl-9 pr-9 bg-card/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary"
            value={topicSearch}
            onChange={(e) => onTopicSearchChange(e.target.value)}
          />
          {topicSearch && (
            <button
              type="button"
              onClick={() => onTopicSearchChange('')}
              aria-label="Clear topic search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
