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
      <DialogContent className="bg-[#1b1722] border-[#2f293a] text-[#f4f4f5] max-w-sm shadow-2xl rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-destructive">Remove Picture?</DialogTitle>
          <DialogDescription className="text-sm text-[#a1a1aa]">
            Are you sure you want to remove your profile picture? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/80 text-white"
          >
            Yes, Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
