import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@ielts/ui';

interface ProfileAvatarDeleteModalProps {
  isOpen: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ProfileAvatarDeleteModal({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: ProfileAvatarDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isDeleting && !open && onClose()}>
      <DialogContent className="bg-card border-border text-foreground w-[92vw] max-w-sm sm:w-full shadow-2xl rounded-lg p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-destructive">Remove Picture?</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to remove your profile picture? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/80 text-white w-full sm:w-auto"
          >
            Yes, Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
