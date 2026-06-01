import { Skeleton } from '@ielts/ui';

export function DashboardSkeleton() {
  return (
    <div className="bg-background py-8">
      <div className="max-w-[1920px] mx-auto px-8 space-y-8">
        <Skeleton className="h-[60px] w-full rounded-2xl bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px] rounded-2xl bg-white/5" />
          ))}
        </div>
        <Skeleton className="h-[200px] w-full rounded-2xl bg-white/5" />
        <Skeleton className="h-[300px] w-full rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}
