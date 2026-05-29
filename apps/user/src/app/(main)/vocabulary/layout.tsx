import type { ReactNode } from 'react';

interface VocabularyLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

/**
 * Parallel routing layout for the Vocabulary route.
 * Maps the standard page content and the dynamic intercepting @modal slot.
 */
export default function VocabularyLayout({ children, modal }: VocabularyLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
