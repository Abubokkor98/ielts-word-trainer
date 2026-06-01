import { TableCell, TableRow, Skeleton } from '@ielts/ui';

export function AdminTableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow key={i}>
          {/* Name */}
          <TableCell>
            <Skeleton className="h-4 w-[140px]" />
          </TableCell>
          {/* Email */}
          <TableCell>
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
          {/* Role Badge */}
          <TableCell>
            <Skeleton className="h-6 w-[100px] rounded-md" />
          </TableCell>
          {/* Created At */}
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          {/* Actions */}
          <TableCell>
            <Skeleton className="h-8 w-8 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
