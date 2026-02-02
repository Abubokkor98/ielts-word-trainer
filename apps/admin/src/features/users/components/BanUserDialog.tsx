import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  VStack,
  Text,
} from '@chakra-ui/react';
import { Button } from '@ielts/ui';
import { useRef } from 'react';
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
            <VStack spacing={4}>
              <Text>Ban User</Text>
            </VStack>
          </AlertDialogHeader>

          <AlertDialogBody textAlign="center" color="gray.500" py={6}>
            Are you sure you want to ban <strong>{user?.name}</strong>? <br />
            They will no longer be able to log in.
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
              Ban User
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
