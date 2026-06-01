import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ielts/ui';
import { Button } from '@ielts/ui';

interface DeleteAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  adminName: string | null;
}

export function DeleteAdminDialog({
  isOpen,
  onClose,
  onConfirm,
  adminName,
}: DeleteAdminDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-xl p-6 border border-border bg-card">
        <DialogHeader className="text-center sm:text-center pb-2">
          <DialogTitle className="text-lg font-bold text-destructive">
            Delete Admin
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="py-4 text-center text-sm text-muted-foreground leading-relaxed">
          Are you sure you want to delete <strong>{adminName}</strong>? <br />
          This action cannot be undone.
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
            Delete Admin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
