'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DashboardChartProps {
  type: 'area' | 'bar' | 'line';
  data: any[];
  dataKeys: { key: string; color: string; name?: string }[];
  xAxisKey: string;
  height?: number | string;
}

export const DashboardChart = ({
  type,
  data,
  dataKeys,
  xAxisKey,
  height = 300,
}: DashboardChartProps) => {
  const gridColor = '#2f293a';
  const textColor = '#aaaaaa';
  const tooltipBg = '#1b1722';
  const tooltipBorder = '#2f293a';

  const CommonProps = {
    data,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };

  const AxisProps = {
    stroke: textColor,
    fontSize: 11,
    tickLine: false,
    axisLine: false,
  };

  const TooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }}
          className="p-3 border rounded-xl shadow-xl glass-card text-xs text-zinc-300 font-medium"
        >
          <div className="font-bold mb-2 text-zinc-100">
            {label}
          </div>
          <div className="space-y-1">
            {payload.map((entry: any) => (
              <div key={`${entry.dataKey}-${entry.value}`} style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart {...CommonProps}>
            <defs>
              {dataKeys.map((k, _i) => (
                <linearGradient key={k.key} id={`color${k.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={k.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={k.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey={xAxisKey} {...AxisProps} dy={10} />
            <YAxis {...AxisProps} dx={-10} />
            <Tooltip content={<TooltipContent />} cursor={{ fill: 'transparent' }} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
            {dataKeys.map((k) => (
              <Area
                key={k.key}
                type="monotone"
                dataKey={k.key}
                stroke={k.color}
                fillOpacity={1}
                fill={`url(#color${k.key})`}
                name={k.name || k.key}
              />
            ))}
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...CommonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey={xAxisKey} {...AxisProps} dy={10} />
            <YAxis {...AxisProps} dx={-10} />
            <Tooltip content={<TooltipContent />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
            {dataKeys.map((k) => (
              <Bar
                key={k.key}
                dataKey={k.key}
                fill={k.color}
                radius={[4, 4, 0, 0]}
                name={k.name || k.key}
              />
            ))}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...CommonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey={xAxisKey} {...AxisProps} dy={10} />
            <YAxis {...AxisProps} dx={-10} />
            <Tooltip content={<TooltipContent />} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
            {dataKeys.map((k) => (
              <Line
                key={k.key}
                type="monotone"
                dataKey={k.key}
                stroke={k.color}
                strokeWidth={2}
                dot={{ r: 4, fill: k.color }}
                activeDot={{ r: 6 }}
                name={k.name || k.key}
              />
            ))}
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height as any}>
      {renderChart()}
    </ResponsiveContainer>
  );
};
