import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Text,
} from '@chakra-ui/react';
import { Button } from '@ielts/ui';
import { useRef } from 'react';

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
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(2px)">
        <AlertDialogContent borderRadius="xl" boxShadow="2xl">
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            color="red.500"
            pt={8}
            pb={0}
          >
            <Text>Delete Admin</Text>
          </AlertDialogHeader>

          <AlertDialogBody textAlign="center" color="gray.500" py={6}>
            Are you sure you want to delete <strong>{adminName}</strong>? <br />
            This action cannot be undone.
          </AlertDialogBody>

          <AlertDialogFooter justifyContent="center" pb={8} gap={3}>
            <Button
              ref={cancelRef}
              onClick={onClose}
              variant="outline"
              borderRadius="lg"
              px={6}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              borderRadius="lg"
              px={6}
            >
              Delete Admin
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
