import { CardHeader, Input } from '@ielts/ui';
import { Search } from 'lucide-react';

interface UserSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function UserSearch({ search, onSearchChange }: UserSearchProps) {
  return (
    <CardHeader className="p-0 pb-4">
      <div className="relative w-full max-w-[400px]">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-border"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search size={16} />
        </div>
      </div>
    </CardHeader>
  );
}
