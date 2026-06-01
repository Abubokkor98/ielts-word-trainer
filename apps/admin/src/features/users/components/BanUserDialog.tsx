import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ielts/ui';
import { Button } from '@ielts/ui';
import type { User } from '../types';

interface BanUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
}

export function BanUserDialog({
  isOpen,
  onClose,
  onConfirm,
  user,
}: BanUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-xl p-6 border border-border bg-card">
        <DialogHeader className="text-center sm:text-center pb-2">
          <DialogTitle className="text-lg font-bold text-destructive">
            Ban User
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="py-4 text-center text-sm text-muted-foreground leading-relaxed">
          Are you sure you want to ban <strong>{user?.name}</strong>? <br />
          They will no longer be able to log in.
        </DialogDescription>

        <DialogFooter className="flex flex-row justify-center sm:justify-center gap-3 pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-lg px-6"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="rounded-lg px-6"
          >
            Ban User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
