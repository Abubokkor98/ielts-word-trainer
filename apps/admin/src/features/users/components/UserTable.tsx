import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ielts/ui';
import { Ban, Calendar, CheckCircle, Eye, Mail } from 'lucide-react';
import { UserTableSkeleton } from './UserTableSkeleton';
import type { User } from '../types';

interface UserTableProps {
  isLoading: boolean;
  users?: User[];
  onViewUser: (user: User) => void;
  onStatusChange: (userId: string, status: 'active' | 'banned') => void;
  onBanUser: (user: User) => void;
}

export function UserTable({
  isLoading,
  users,
  onViewUser,
  onStatusChange,
  onBanUser,
}: UserTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>XP</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <UserTableSkeleton />
          ) : users && users.length > 0 ? (
            users.map((u: User) => (
              <TableRow key={u._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                        {getInitials(u.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-bold text-foreground block leading-tight">{u.name}</span>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <Mail size={10} />
                        <span>{u.email}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={u.status === 'banned' ? 'destructive' : 'secondary'}
                  >
                    {u.status === 'banned' ? 'Banned' : 'Active'}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-foreground">{u.xp || 0}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      aria-label="View user details"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onViewUser(u)}
                    >
                      <Eye size={16} />
                    </Button>
                    {u.status === 'banned' ? (
                      <Button
                        aria-label="Activate user"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => onStatusChange(u._id, 'active')}
                      >
                        <CheckCircle size={16} />
                      </Button>
                    ) : (
                      <Button
                        aria-label="Ban user"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => onBanUser(u)}
                      >
                        <Ban size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
