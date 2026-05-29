import { Skeleton } from '@ielts/ui';

const SKELETON_CARD_COUNT = 8;
const SKELETON_CARD_IDS = Array.from(
  { length: SKELETON_CARD_COUNT },
  (_, index) => `vocabulary-skeleton-${index}`,
);

export function VocabularyPageSkeleton() {
  return (
    <main className="dark w-full bg-background py-8 min-h-screen">
      <div className="container max-w-[1324px] px-6 mx-auto">
        <header className="mb-8 text-center lg:text-left space-y-4">
          <Skeleton className="h-12 w-full md:w-[350px] max-w-[350px] mb-2" />
          <Skeleton className="h-6 w-full md:w-[420px] max-w-[420px] mb-6" />
          <Skeleton className="h-12 w-full rounded-md" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKELETON_CARD_IDS.map((id) => (
            <Skeleton key={id} className="h-[220px] w-full rounded-md" />
          ))}
        </div>
      </div>
    </main>
  );
}
