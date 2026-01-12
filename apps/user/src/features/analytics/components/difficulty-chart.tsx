import { Card, CardHeader, CardContent } from '@ielts/ui';
import { Heading } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DifficultyAccuracy } from '../types';

interface DifficultyChartProps {
  data: DifficultyAccuracy[];
}

export function DifficultyChart({ data }: DifficultyChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <Heading size="md" color="gray.50">
          Accuracy by Difficulty
        </Heading>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="difficulty" stroke="#cbd5e0" />
            <YAxis stroke="#cbd5e0" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2d3748',
                border: '1px solid #4a5568',
              }}
            />
            <Bar dataKey="accuracy" fill="#1e88e5" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
