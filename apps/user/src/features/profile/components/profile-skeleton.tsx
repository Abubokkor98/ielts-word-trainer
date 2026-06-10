import { Skeleton } from '@ielts/ui';

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header Skeleton */}
      <header className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-64 rounded-lg" />
      </header>

      {/* Mobile Tabs Skeleton */}
      <div className="lg:hidden">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Sidebar + Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Skeleton (desktop only) */}
        <aside className="hidden lg:block w-56 shrink-0">
          <Skeleton className="h-4 w-20 rounded mb-4" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </aside>

        {/* Content Panel Skeleton */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <Skeleton className="h-[160px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
