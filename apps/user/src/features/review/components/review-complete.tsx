import { Button, Card, CardContent, Separator, cn } from '@ielts/ui';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface ReviewCompleteProps {
  reviewedCount: number;
  onRestart: () => void;
  onReviewMore: () => void;
}

export function ReviewComplete({ reviewedCount, onRestart, onReviewMore }: ReviewCompleteProps) {
  return (
    <div className="bg-background py-8 px-4 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[800px] space-y-6 mx-auto">
        <Card className="border border-border bg-card/60 relative overflow-hidden shadow-xl p-8">
          {/* Subtle glow background */}
          <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full blur-[80px] bg-violet-500/10 pointer-events-none" />
          
          <CardContent className="p-0 flex flex-col items-center text-center space-y-6 py-8 relative z-10">
            <span className="text-6xl" role="img" aria-label={reviewedCount === 0 ? "books" : "tada"}>
              {reviewedCount === 0 ? '📚' : '🎉'}
            </span>
            
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              {reviewedCount === 0 ? 'All Caught Up!' : 'Review Complete!'}
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-md">
              {reviewedCount === 0
                ? "You don't have any words due for review right now. Come back tomorrow after taking some quizzes!"
                : `Excellent work! You reviewed ${reviewedCount} word${
                    reviewedCount > 1 ? 's' : ''
                  } today.`}
            </p>
            
            <Separator className="bg-border w-full my-6" />
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
              <Button
                size="lg"
                onClick={onRestart}
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </Button>
              
              {reviewedCount > 0 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onReviewMore}
                  className="w-full sm:w-auto border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300 font-semibold flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  Review More
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
