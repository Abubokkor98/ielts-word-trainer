import {
  CardHeader,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ielts/ui';
import { Search } from 'lucide-react';

type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

interface VocabularyFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  difficulty: Difficulty;
  onDifficultyChange: (value: Difficulty) => void;
}

export function VocabularyFilters({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
}: VocabularyFiltersProps) {
  return (
    <CardHeader className="p-6 pb-0">
      <div className="flex flex-row items-center gap-4">
        <div className="relative w-full max-w-[300px]">
          <Input
            placeholder="Search words..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-transparent border-border hover:border-primary/50 focus-visible:ring-primary"
            aria-label="Search words"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={16} />
          </div>
        </div>

        <Select
          value={difficulty}
          onValueChange={(value) => onDifficultyChange(value as Difficulty)}
        >
          <SelectTrigger className="w-[180px] bg-transparent border-border hover:border-primary/50 focus:ring-primary">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent className="border border-border bg-card">
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardHeader>
  );
}

