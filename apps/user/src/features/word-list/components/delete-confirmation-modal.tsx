'use client';

import { Button } from '@ielts/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// ============================================================================
// Types
// ============================================================================

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  listName: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function DeleteConfirmationModal({
  isOpen,
  listName,
  isPending,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="w-full max-w-sm glass-panel border border-border p-6 rounded-2xl shadow-2xl relative z-10"
          >
            <h3 className="text-base font-bold text-foreground mb-2">Delete Collection</h3>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Are you sure you want to delete &quot;{listName}&quot;? This action is permanent and
              will remove all saved words from this collection.
            </p>
            <div className="flex justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold rounded-lg bg-zinc-900 border-border/80 hover:bg-zinc-800 text-foreground"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5"
                onClick={onConfirm}
                disabled={isPending}
              >
                {isPending && (
                  <span className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent flex-shrink-0" />
                )}
                {isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
