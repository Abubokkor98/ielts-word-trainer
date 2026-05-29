import { Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from '@ielts/ui';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  className?: string;
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  const isLongText = String(value).length > 7;

  return (
    <Card role="region" aria-label={`${label} statistic`}>
      <CardHeader className="p-6 pb-2">
        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex items-center justify-between w-full gap-2">
          <CardTitle
            className={cn(
              "font-bold leading-none tracking-tight break-all truncate",
              isLongText ? "text-xl" : "text-3xl",
              className || "text-foreground"
            )}
          >
            {value}
          </CardTitle>
          {icon && (
            <span className="text-2xl flex-shrink-0" aria-hidden="true">
              {icon}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
