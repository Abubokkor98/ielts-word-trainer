import { Alert, AlertDescription, AlertIcon, Box, Heading, VStack } from '@chakra-ui/react';
import { Card, CardContent } from '@ielts/ui';
import { AlertSeverity, type DashboardAlert } from '../types';

interface AlertSectionProps {
  alerts: DashboardAlert[];
}

export const AlertSection = ({ alerts }: AlertSectionProps) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <Heading size="sm" mb={4}>
          ⚠️ Needs Attention ({alerts.length})
        </Heading>
        <VStack spacing={3} align="stretch">
          {alerts.map((alert, idx) => (
            <Alert
              // biome-ignore lint/suspicious/noArrayIndexKey: Order doesn't matter for read-only keys
              key={idx}
              status={alert.severity === AlertSeverity.CRITICAL ? 'error' : 'warning'}
              borderRadius="md"
            >
              <AlertIcon />
              <Box flex="1">
                <AlertDescription>{alert.message}</AlertDescription>
              </Box>
            </Alert>
          ))}
        </VStack>
      </CardContent>
    </Card>
  );
};
