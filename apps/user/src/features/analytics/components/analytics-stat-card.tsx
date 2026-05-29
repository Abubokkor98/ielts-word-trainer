import { Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from '@ielts/ui';

interface AnalyticsStatCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function AnalyticsStatCard({ label, value, className }: AnalyticsStatCardProps) {
  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <CardTitle className={cn("text-3xl font-bold leading-none tracking-tight", className || "text-primary")}>
          {value}
        </CardTitle>
      </CardContent>
    </Card>
  );
}
