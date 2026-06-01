import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from '@ielts/ui';

interface DeleteWordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteWordDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteWordDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-xl p-6 border border-border bg-card">
        <DialogHeader className="text-center sm:text-center pb-2">
          <DialogTitle className="text-lg font-bold text-destructive">
            Delete Word
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 text-center text-sm text-muted-foreground leading-relaxed">
          Are you sure you want to delete this word? <br />
          This action cannot be undone.
        </div>

        <DialogFooter className="flex flex-row justify-center sm:justify-center gap-3 pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-lg px-6"
            disabled={isLoading}
          >
            No, Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="rounded-lg px-6"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

