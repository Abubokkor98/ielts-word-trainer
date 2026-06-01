import { TableCell, TableRow, Skeleton } from '@ielts/ui';

export const UserTableSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow key={i}>
          {/* User (Avatar + Name + Email) */}
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[180px]" />
              </div>
            </div>
          </TableCell>
          {/* Status Badge */}
          <TableCell>
            <Skeleton className="h-6 w-[70px] rounded-md" />
          </TableCell>
          {/* XP */}
          <TableCell>
            <Skeleton className="h-5 w-[50px]" />
          </TableCell>
          {/* Joined */}
          <TableCell>
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-3.5" />
              <Skeleton className="h-3.5 w-[90px]" />
            </div>
          </TableCell>
          {/* Actions */}
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
