import { axiosInstance } from '@ielts/auth';
import { Button, useToast } from '@ielts/ui';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

export const QuickActions = () => {
  const { toast } = useToast();
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
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        description: 'User data has been exported successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not export user data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="glass-card border border-border bg-card/50 p-6 rounded-2xl h-full space-y-4">
      <header>
        <h3 className="text-sm font-bold text-foreground">
          Data Tools
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Manage platform data and exports
        </p>
      </header>
      
      <div className="space-y-3">
        <Button
          variant="outline"
          disabled={isExporting}
          onClick={handleExport}
          className="w-full justify-start text-muted-foreground hover:text-foreground border-border hover:bg-accent hover:text-accent-foreground"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
          ) : (
            <Download className="h-4 w-4 mr-2 text-primary" />
          )}
          <span>{isExporting ? 'Exporting...' : 'Export All User Data (CSV)'}</span>
        </Button>
      </div>
    </section>
  );
};
