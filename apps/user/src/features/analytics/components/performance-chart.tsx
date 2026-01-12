import { Heading } from '@chakra-ui/react';
import { Card, CardContent, CardHeader } from '@ielts/ui';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PerformanceTrend } from '../types';

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
            <Line type="monotone" dataKey="score" stroke="#1e88e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
