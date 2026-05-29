import { Card, CardContent, Separator, Skeleton } from '@ielts/ui';

export default function WordDetailSkeleton() {
  return (
    <main className="bg-background min-h-[80vh] py-12 w-full">
      <div className="container mx-auto px-4 max-w-3xl">
        <Skeleton className="h-10 w-[120px] sm:w-[150px] mb-8 rounded-md" />

        <Card className="bg-card/60 border border-border">
          <CardContent className="p-4 md:p-8">
            <div className="flex flex-col gap-6">
              <Skeleton className="h-12 w-full sm:w-[280px] rounded-md" />
              <Skeleton className="h-5 w-full sm:w-[150px] rounded-md" />
              
              <Separator className="my-4 bg-border/40" />
              
              <div className="flex flex-col gap-4">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-[90%] rounded-md" />
                <Skeleton className="h-4 w-[95%] rounded-md" />
                <Skeleton className="h-4 w-[85%] rounded-md" />
                <Skeleton className="h-4 w-[60%] rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
