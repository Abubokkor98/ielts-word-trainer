import { Card, CardHeader, CardContent } from '@ielts/ui';
import { Heading } from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PerformanceTrend } from '../types';

interface PerformanceChartProps {
  data: PerformanceTrend[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <Heading size="md" color="gray.50">
          Performance Trend
        </Heading>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="date" stroke="#cbd5e0" />
            <YAxis stroke="#cbd5e0" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2d3748',
                border: '1px solid #4a5568',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#1e88e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
