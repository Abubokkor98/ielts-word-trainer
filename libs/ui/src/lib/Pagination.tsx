import { cn } from '@ielts/ui/lib/utils';
import { Button } from '../components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const ELLIPSIS = '...';

/**
 * Generate page numbers to display with ellipsis for large page counts
 * Pattern: [1, 2, 3, ..., current-1, current, current+1, ..., last-2, last-1, last]
 */
function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
): (number | string)[] {
  // If total pages is small, show all pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  // Calculate range around current page
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  // Show first few pages or ellipsis
  if (!showLeftEllipsis) {
    // Show pages 2 to rightSiblingIndex
    for (let i = 2; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }
  } else {
    // Show ellipsis and current page range
    pages.push(ELLIPSIS);
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }
  }

  // Show last few pages or ellipsis
  if (!showRightEllipsis && rightSiblingIndex < totalPages) {
    for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
      pages.push(i);
    }
  } else if (showRightEllipsis) {
    pages.push(ELLIPSIS);
  }

  // Always show last page if totalPages > 1
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const pageNumbers = generatePageNumbers(currentPage, totalPages, siblingCount);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-10">
      {/* Previous Button */}
      <Button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={isFirstPage}
        variant="outline"
        size="sm"
        className={cn(
          'border-primary text-primary hover:bg-primary/10 hover:text-primary',
          isFirstPage && 'opacity-50 pointer-events-none',
        )}
      >
        Previous
      </Button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === ELLIPSIS) {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: Index is stable for static elements
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground select-none">
              {ELLIPSIS}
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Button
            key={page}
            onClick={() => onPageChange(pageNum)}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'min-w-[40px]',
              isActive
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-primary text-primary hover:bg-primary/10 hover:text-primary',
            )}
          >
            {pageNum}
          </Button>
        );
      })}

      {/* Next Button */}
      <Button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={isLastPage}
        variant="outline"
        size="sm"
        className={cn(
          'border-primary text-primary hover:bg-primary/10 hover:text-primary',
          isLastPage && 'opacity-50 pointer-events-none',
        )}
      >
        Next
      </Button>
    </nav>
  );
}
