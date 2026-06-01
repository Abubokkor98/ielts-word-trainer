'use client';

import { axiosInstance, useAuthStore } from '@ielts/auth';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
} from '@ielts/ui';
import type { Admin } from 'apps/admin/src/types/admin';
import { Plus, Shield, ShieldAlert, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminTableSkeleton } from './components/AdminTableSkeleton';
import { DeleteAdminDialog } from './components/DeleteAdminDialog';

const AdminTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Created At</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
);

export function AdminsContainer() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isSuperAdmin = user?.role === 'super_admin';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    data: adminsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'admins'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/admins');
      return data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/admin/admins/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Admin deleted',
        description: 'Admin deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'admins'] });
      setIsDialogOpen(false);
      setAdminToDelete(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Failed to delete admin',
        description: err.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    },
  });

  const handleDeleteClick = (id: string, name: string) => {
    setAdminToDelete({ id, name });
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (adminToDelete) {
      deleteMutation.mutate(adminToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Management</h1>
        {isSuperAdmin && (
          <Button
            onClick={() => alert('Create Admin Modal TODO')}
            className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Plus size={16} className="mr-2" />
            Create Admin
          </Button>
        )}
      </header>

      <Card className="border border-border bg-transparent shadow-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="overflow-x-auto">
              <Table>
                <AdminTableHeader />
                <TableBody>
                  <AdminTableSkeleton />
                </TableBody>
              </Table>
            </div>
          ) : isError ? (
            <p className="p-6 text-center text-sm text-destructive">Failed to load admins.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <AdminTableHeader />
                <TableBody>
                  {adminsData?.map((admin: Admin) => (
                    <TableRow key={admin._id}>
                      <TableCell className="font-bold">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={admin.role === 'super_admin' ? 'destructive' : 'secondary'}
                          className="flex items-center gap-1.5 w-fit"
                        >
                          {admin.role === 'super_admin' ? (
                            <>
                              <ShieldAlert size={12} />
                              <span>Super Admin</span>
                            </>
                          ) : (
                            <>
                              <Shield size={12} />
                              <span>Admin</span>
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(admin.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        {isSuperAdmin && admin._id !== user?.id && (
                          <Button
                            aria-label="Delete admin"
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10 h-8 w-8"
                            onClick={() =>
                              handleDeleteClick(admin._id, admin.name)
                            }
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {adminsData?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No admins found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteAdminDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        adminName={adminToDelete?.name || null}
      />
    </div>
  );
}
