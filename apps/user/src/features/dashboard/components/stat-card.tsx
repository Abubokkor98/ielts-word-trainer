import { Card, CardContent } from '@ielts/ui';
import { Heading, HStack, Text, VStack } from '@chakra-ui/react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color: string;
}

export function StatCard({ label, value, icon, color }: StatCardProps) {
  const isLongText = String(value).length > 7;

  return (
    <Card role="region" aria-label={`${label} statistic`}>
      <CardContent>
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="gray.400" fontWeight="600">
            {label}
          </Text>
          <HStack w="full" overflow="hidden">
            <Heading
              size={isLongText ? 'lg' : '2xl'}
              color={color}
              aria-label={`${label}: ${value}`}
              noOfLines={1}
              wordBreak="break-word"
            >
              {value}
            </Heading>
            {icon && (
              <Text fontSize="2xl" aria-hidden="true" flexShrink={0}>
                {icon}
              </Text>
            )}
          </HStack>
        </VStack>
      </CardContent>
    </Card>
  );
}
