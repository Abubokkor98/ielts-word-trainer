'use client';

import { useToast } from '@chakra-ui/react';
import { useIsViewer } from '@ielts/auth';

/**
 * Hook to handle demo viewer restrictions
 * Shows a toast when viewer attempts write operations
 * Returns a function to check if action should proceed
 *
 * @example
 * const checkViewerRestriction = useViewerRestriction();
 *
 * const handleCreate = () => {
 *   if (checkViewerRestriction()) return; // Blocked for viewers
 *   // Proceed with create logic
 * };
 */
export const useViewerRestriction = () => {
  const isViewer = useIsViewer();
  const toast = useToast();

  const checkRestriction = (action: 'create' | 'edit' | 'delete' = 'edit') => {
    if (isViewer) {
      const actionText = {
        create: 'create',
        edit: 'modify',
        delete: 'delete',
      }[action];

      toast({
        title: 'Action Not Allowed',
        description: `Demo accounts cannot ${actionText} data. All write operations are disabled in demo mode.`,
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      return true; // Action is blocked
    }
    return false; // Action can proceed
  };

  return checkRestriction;
};
