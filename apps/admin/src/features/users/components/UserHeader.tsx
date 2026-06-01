import { Button } from '@ielts/ui';
import { Download } from 'lucide-react';

interface UserHeaderProps {
  onExport: () => void;
}

export function UserHeader({ onExport }: UserHeaderProps) {
  return (
    <header className="flex justify-between items-center pb-4 border-b border-border">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
      <Button
        variant="outline"
        onClick={onExport}
        className="rounded-lg border-border hover:bg-accent hover:text-accent-foreground"
      >
        <Download size={16} className="mr-2" />
        Export Users
      </Button>
    </header>
  );
}
