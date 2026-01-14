import {
  Box,
  Flex,
  Heading,
  Icon,
  StatArrow,
  Stat,
  Text,
  HStack,
} from '@chakra-ui/react';
import { Card, CardContent } from '@ielts/ui';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  sublabel: string;
  value: number | string | undefined;
  change?: number; // Percent change
  icon: LucideIcon;
  color: string;
}

export const MetricCard = ({
  label,
  sublabel,
  value,
  change,
  icon,
  color,
}: MetricCardProps) => {
  const isPositive = (change || 0) >= 0;
  // Neutral usually means small variation, e.g. < 5% or 0% depending on metric
  // Here we just color positive/negative

  // Extract color name for bg (e.g. blue.500 -> blue)
  const colorName = color.split('.')[0];

  return (
    <Card>
      <CardContent className="p-6">
        <Flex justify="space-between" align="start">
          <Box>
            <Text fontSize="sm" color="gray.500" fontWeight="600">
              {label}
            </Text>
            <Text fontSize="xs" color="gray.400" mb={2}>
              {sublabel}
            </Text>
            <Heading size="xl" color={color}>
              {value ?? '-'}
            </Heading>
            {change !== undefined && (
              <Stat mt={2}>
                <HStack spacing={1}>
                  <StatArrow type={isPositive ? 'increase' : 'decrease'} />
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={isPositive ? 'green.500' : 'red.500'}
                  >
                    {Math.abs(change).toFixed(1)}%
                  </Text>
                </HStack>
              </Stat>
            )}
          </Box>
          <Box p={3} bg={`${colorName}.50`} borderRadius="lg">
            <Icon as={icon} boxSize={6} color={color} />
          </Box>
        </Flex>
      </CardContent>
    </Card>
  );
};
