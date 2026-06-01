import {
  Avatar,
  AvatarFallback,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@ielts/ui';
import { Award, Calendar, Flame, Mail, Shield } from 'lucide-react';
import type { User } from '../types';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-xl">
        {/* Banner with gradient for premium feel */}
        <div className="relative h-28 bg-gradient-to-r from-primary to-primary/80">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <Avatar className="h-20 w-20 border-4 border-card bg-primary text-primary-foreground shadow-lg">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="px-8 pb-8 pt-12">
          <div className="flex flex-col gap-6">
            {/* User Info Header */}
            <DialogHeader className="flex flex-col items-center gap-1 p-0 text-center sm:text-center">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {user.name}
              </DialogTitle>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail size={14} className="shrink-0" />
                <span>{user.email}</span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1 text-xs uppercase tracking-wider">
                  {user.role || 'USER'}
                </Badge>
                <Badge
                  variant={
                    user.status === 'active'
                      ? 'outline'
                      : user.status === 'banned'
                      ? 'destructive'
                      : 'secondary'
                  }
                  className="px-3 py-1 text-xs uppercase tracking-wider"
                >
                  {user.status || 'active'}
                </Badge>
              </div>
            </DialogHeader>

            <hr className="border-border" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center rounded-xl border border-border bg-muted/30 p-4 text-center">
                <Award className="mb-2 h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  {user.xp || 0}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total XP
                </span>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-border bg-muted/30 p-4 text-center">
                <Flame className="mb-2 h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  {user.streak || 0}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Streak Days
                </span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Calendar size={16} className="shrink-0 text-primary" />
                <span className="font-medium text-foreground">Member Since:</span>
                <span>
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {user.lastQuizDate && (
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Award size={16} className="shrink-0 text-primary" />
                  <span className="font-medium text-foreground">Last Activity:</span>
                  <span>
                    {new Date(user.lastQuizDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Shield size={16} className="shrink-0 text-primary" />
                <span className="font-medium text-foreground">Account Status:</span>
                <span
                  className={`capitalize font-medium ${
                    user.status === 'banned' ? 'text-destructive' : 'text-foreground'
                  }`}
                >
                  {user.status === 'banned' ? 'Restricted (Banned)' : 'Good Standing'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

