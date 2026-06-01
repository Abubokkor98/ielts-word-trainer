import { TableCell, TableRow, Skeleton } from '@ielts/ui';

export function ProblemWordsTableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <TableRow key={i}>
          {/* Word */}
          <TableCell>
            <Skeleton className="h-5 w-[120px]" />
          </TableCell>
          {/* Meaning */}
          <TableCell>
            <Skeleton className="h-5 w-[200px]" />
          </TableCell>
          {/* Difficulty */}
          <TableCell>
            <Skeleton className="h-6 w-[80px] rounded-md" />
          </TableCell>
          {/* Accuracy */}
          <TableCell className="text-right">
            <div className="flex justify-end">
              <Skeleton className="h-6 w-[60px] rounded-md" />
            </div>
          </TableCell>
          {/* Attempts */}
          <TableCell className="text-right">
            <div className="flex justify-end">
              <Skeleton className="h-5 w-[40px]" />
            </div>
          </TableCell>
          {/* Last Updated */}
          <TableCell>
            <Skeleton className="h-5 w-[100px]" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
