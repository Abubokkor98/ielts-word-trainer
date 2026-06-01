import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DailyActiveUser } from '../types';

interface DAUTrendChartProps {
  data: DailyActiveUser[];
}

export const DAUTrendChart = ({ data }: DAUTrendChartProps) => {
  const lineColor = 'hsl(var(--primary))';
  const axisColor = 'hsl(var(--muted-foreground))';
  const gridColor = 'hsl(var(--border))';
  const tooltipBg = 'hsl(var(--card))';

  return (
    <figure className="glass-card border border-border bg-card/50 p-6 rounded-2xl">
      <figcaption className="mb-4">
        <h3 className="text-sm font-bold text-card-foreground flex items-center gap-2">
          <span role="img" aria-label="Line Graph">📈</span>
          <span>Daily Active Users (Last 7 Days)</span>
        </h3>
      </figcaption>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="date"
              stroke={axisColor}
              fontSize={11}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('en-US', {
                  weekday: 'short',
                })
              }
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={axisColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--card-foreground))',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={lineColor}
              strokeWidth={2.5}
              dot={{ r: 4, fill: lineColor, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
};
