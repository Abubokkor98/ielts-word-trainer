import { Heading, VStack, useToast, Text } from '@chakra-ui/react';
import { Button, Card, CardContent } from '@ielts/ui';
import { useState } from 'react';
import { axiosInstance } from '@ielts/auth';
import { Download } from 'lucide-react';

export const QuickActions = () => {
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await axiosInstance.get('/admin/users/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `users-export-${new Date().toISOString().split('T')[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not export user data',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card h="full">
      <CardContent>
        <Heading size="sm" mb={2}>
          Data Tools
        </Heading>
        <Text fontSize="xs" color="gray.500" mb={4}>
          Manage platform data and exports
        </Text>
        <VStack align="stretch" spacing={3}>
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
            isLoading={isExporting}
            onClick={handleExport}
            width="full"
            justifyContent="flex-start"
          >
            Export All User Data (CSV)
          </Button>
        </VStack>
      </CardContent>
    </Card>
  );
};
