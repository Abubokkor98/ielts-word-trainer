import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  label: string;
  sublabel: string;
  value: number | string | undefined;
  change?: number; // Percent change
  icon: LucideIcon;
}

export const MetricCard = ({
  label,
  sublabel,
  value,
  change,
  icon: IconComponent,
}: MetricCardProps) => {
  const isPositive = (change ?? 0) >= 0;

  return (
    <article className="border border-border bg-transparent p-5 rounded-xl transition-colors duration-200 hover:border-muted-foreground/30">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block">
            {label}
          </span>

          <div className="text-2xl font-extrabold text-foreground">
            {value ?? '-'}
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            {change !== undefined && (
              <div className={`flex items-center text-[11px] font-bold ${
                isPositive ? 'text-primary' : 'text-destructive'
              }`}>
                {isPositive ? (
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                )}
                <span>{Math.abs(change).toFixed(1)}%</span>
              </div>
            )}
            <span className="text-[10px] text-muted-foreground">
              {sublabel}
            </span>
          </div>
        </div>

        <div className="p-1 shrink-0 text-primary">
          <IconComponent className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
};
