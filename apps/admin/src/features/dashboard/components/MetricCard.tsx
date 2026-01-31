import {
  Box,
  Flex,
  HStack,
  Icon,
  Stat,
  StatArrow,
  Text,
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
  const isPositive = (change ?? 0) >= 0;

  // Extract color name for bg (e.g. blue.500 -> blue)
  // This is a bit fragile but keeps consistent with existing usage
  const colorName = color.split('.')[0];

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6">
        <Flex justify="space-between" align="start">
          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.500"
              _dark={{ color: 'gray.400' }}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {label}
            </Text>

            <HStack align="baseline" mt={1}>
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="gray.800"
                _dark={{ color: 'white' }}
              >
                {value ?? '-'}
              </Text>
            </HStack>

            <Flex align="center" mt={2} gap={2}>
              {change !== undefined && (
                <Stat flex="none">
                  <HStack spacing={0}>
                    <StatArrow
                      type={isPositive ? 'increase' : 'decrease'}
                      mr={1}
                    />
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color={isPositive ? 'green.500' : 'red.500'}
                    >
                      {Math.abs(change).toFixed(1)}%
                    </Text>
                  </HStack>
                </Stat>
              )}
              <Text fontSize="xs" color="gray.400">
                {sublabel}
              </Text>
            </Flex>
          </Box>

          <Box
            p={3}
            bg={`${colorName}.50`}
            _dark={{ bg: `${colorName}.900` }}
            borderRadius="xl"
            color={color}
          >
            <Icon as={icon} boxSize={6} />
          </Box>
        </Flex>
      </CardContent>
    </Card>
  );
};
