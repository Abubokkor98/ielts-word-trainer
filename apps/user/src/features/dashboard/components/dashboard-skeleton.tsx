import { Skeleton } from '@ielts/ui';

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <Skeleton className="h-[60px] w-full rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[200px] w-full rounded-xl" />
    </div>
  );
}
