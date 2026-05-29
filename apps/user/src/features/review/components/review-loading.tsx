import { Card, CardContent, CardHeader, Skeleton } from '@ielts/ui';

export function ReviewLoading() {
  return (
    <div className="bg-background py-8 px-4 min-h-screen">
      <div className="max-w-[900px] mx-auto space-y-6">
        {/* Header Skeleton */}
        <Card className="border border-border bg-card/60 p-6">
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Skeleton className="h-10 w-[120px] rounded-md" />
              <div className="flex flex-col items-start sm:items-end space-y-2">
                <Skeleton className="h-6 w-[150px] rounded-md" />
                <Skeleton className="h-4 w-[100px] rounded-md" />
              </div>
              <div className="hidden sm:block w-[120px]" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </Card>

        {/* Flashcard Skeleton */}
        <Card className="border-2 border-border bg-card/60 min-h-[450px]">
          <CardHeader className="p-6">
            <div className="flex justify-between items-center w-full">
              <Skeleton className="h-7 w-[100px] rounded-full" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-[80px] rounded-full" />
                <Skeleton className="h-6 w-[80px] rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex flex-col items-center justify-center min-h-[320px] space-y-8 px-4">
              <div className="flex flex-col items-center space-y-6 w-full">
                {/* Word skeleton */}
                <Skeleton className="h-[60px] w-[280px] rounded-md" />
                {/* Helper text skeleton */}
                <div className="flex flex-col items-center space-y-2">
                  <Skeleton className="h-5 w-[180px] rounded-md" />
                  <Skeleton className="h-10 w-[100px] rounded-md" />
                  <Skeleton className="h-5 w-[160px] rounded-md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
