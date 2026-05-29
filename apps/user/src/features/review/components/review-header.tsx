import { Button, Card, CardContent, Progress } from '@ielts/ui';
import { ArrowLeft } from 'lucide-react';

interface ReviewHeaderProps {
  currentIndex: number;
  totalCards: number;
  reviewedCount: number;
  progress: number;
  onExit: () => void;
}

export function ReviewHeader({
  currentIndex,
  totalCards,
  reviewedCount,
  progress,
  onExit,
}: ReviewHeaderProps) {
  return (
    <Card className="border border-border bg-card/60 p-6 w-full shadow-md">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            onClick={onExit}
            className="text-violet-400 hover:text-violet-300 hover:bg-white/5 px-2 md:px-4"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={20} />
              <span className="hidden md:inline">Dashboard</span>
            </span>
          </Button>
          
          <div className="flex flex-col items-center">
            <span className="font-semibold text-foreground text-lg">
              Card {currentIndex + 1} of {totalCards}
            </span>
            <span className="text-sm text-muted-foreground">
              {reviewedCount} reviewed
            </span>
          </div>
          
          {/* Responsive Spacer matching exit button width */}
          <div className="w-[40px] md:w-[120px] pointer-events-none" />
        </div>
        
        <Progress
          value={progress}
          className="h-2 w-full bg-secondary"
        />
      </CardContent>
    </Card>
  );
}
