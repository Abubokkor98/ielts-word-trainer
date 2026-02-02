import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  VStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { useRef } from 'react';

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
            color="red.500"
            fontWeight="bold"
            pt={8}
            pb={0}
          >
            <VStack spacing={4}>
              <Text>Delete Word</Text>
            </VStack>
          </AlertDialogHeader>

          <AlertDialogBody textAlign="center" color="gray.500" py={6}>
            Are you sure you want to delete this word? <br />
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
              No, Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              isLoading={isLoading}
              borderRadius="lg"
              px={6}
            >
              Yes, Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
