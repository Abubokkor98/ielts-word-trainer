import { Card, CardContent } from '@ielts/ui';
import { Heading, Text, VStack } from '@chakra-ui/react';

interface AnalyticsStatCardProps {
  label: string;
  value: string | number;
  color: string;
}

export function AnalyticsStatCard({
  label,
  value,
  color,
}: AnalyticsStatCardProps) {
  return (
    <Card>
      <CardContent>
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="gray.400" fontWeight="600">
            {label}
          </Text>
          <Heading size="2xl" color={color}>
            {value}
          </Heading>
        </VStack>
      </CardContent>
    </Card>
  );
}
