'use client';

import { Box, useColorModeValue } from '@chakra-ui/react';
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
  const gridColor = useColorModeValue('#E2E8F0', '#2D3748');
  const textColor = useColorModeValue('#4A5568', '#A0AEC0');
  const tooltipBg = useColorModeValue('white', '#1A202C');
  const tooltipBorder = useColorModeValue('#E2E8F0', '#2D3748');

  const CommonProps = {
    data,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };

  const AxisProps = {
    stroke: textColor,
    fontSize: 12,
    tickLine: false,
    axisLine: false,
  };

  const TooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg={tooltipBg}
          p={3}
          border="1px solid"
          borderColor={tooltipBorder}
          borderRadius="md"
          boxShadow="lg"
        >
          <Box fontWeight="bold" mb={2} color={textColor} fontSize="sm">
            {label}
          </Box>
          {payload.map((entry: any, index: number) => (
            <Box key={index} color={entry.color} fontSize="sm">
              {entry.name}: {entry.value}
            </Box>
          ))}
        </Box>
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
              {dataKeys.map((k, i) => (
                <linearGradient key={k.key} id={`color${k.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={k.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={k.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey={xAxisKey} {...AxisProps} dy={10} />
            <YAxis {...AxisProps} dx={-10} />
            <Tooltip content={<TooltipContent />} cursor={{ fill: 'transparent' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
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
            <Tooltip content={<TooltipContent />} cursor={{ fill: 'white', opacity: 0.05 }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
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
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {dataKeys.map((k) => (
              <Line
                key={k.key}
                type="monotone"
                dataKey={k.key}
                stroke={k.color}
                strokeWidth={3}
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
