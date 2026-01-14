import { Box, Heading, useColorModeValue } from '@chakra-ui/react';
import { Card, CardContent } from '@ielts/ui';
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
  const lineColor = useColorModeValue('#3182CE', '#63B3ED');
  const axisColor = useColorModeValue('#718096', '#A0AEC0');
  const gridColor = useColorModeValue('#E2E8F0', '#4A5568');
  const tooltipBg = useColorModeValue('white', '#2D3748');

  return (
    <Card>
      <CardContent>
        <Heading size="sm" mb={4}>
          📈 Daily Active Users (Last 7 Days)
        </Heading>
        <Box height="250px" width="100%">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="date"
                stroke={axisColor}
                fontSize={12}
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
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={lineColor}
                strokeWidth={3}
                dot={{ r: 4, fill: lineColor, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
