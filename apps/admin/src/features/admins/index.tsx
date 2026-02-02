'use client';

import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import { Card, CardContent } from '@ielts/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Admin } from 'apps/admin/src/types/admin';
import { Plus, Shield, ShieldAlert, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminTableSkeleton } from './components/AdminTableSkeleton';
import { DeleteAdminDialog } from './components/DeleteAdminDialog';

const AdminTableHeader = () => (
  <Thead>
    <Tr>
      <Th>Name</Th>
      <Th>Email</Th>
      <Th>Role</Th>
      <Th>Created At</Th>
      <Th>Actions</Th>
    </Tr>
  </Thead>
);

export function AdminsContainer() {
  const { user } = useAuthStore();
  const toast = useToast();
  const queryClient = useQueryClient();
  const isSuperAdmin = user?.role === 'super_admin';
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      toast({ title: 'Admin deleted successfully', status: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'admins'] });
      onClose();
      setAdminToDelete(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Failed to delete admin',
        description: err.response?.data?.message || 'Something went wrong',
        status: 'error',
      });
    },
  });

  const handleDeleteClick = (id: string, name: string) => {
    setAdminToDelete({ id, name });
    onOpen();
  };

  const handleConfirmDelete = () => {
    if (adminToDelete) {
      deleteMutation.mutate(adminToDelete.id);
    }
  };

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Admin Management</Heading>
          {isSuperAdmin && (
            <Button
              leftIcon={<Plus size={16} />}
              colorScheme="brand"
              onClick={() => alert('Create Admin Modal TODO')}
            >
              Create Admin
            </Button>
          )}
        </HStack>

        <Card>
          <CardContent>
            {isLoading ? (
              <Box overflowX="auto" pb={4}>
                <Table variant="simple">
                  <AdminTableHeader />
                  <Tbody>
                    <AdminTableSkeleton />
                  </Tbody>
                </Table>
              </Box>
            ) : isError ? (
              <Text color="red.500">Failed to load admins.</Text>
            ) : (
              <Box overflowX="auto" pb={4}>
                <Table variant="simple">
                  <AdminTableHeader />
                  <Tbody>
                    {adminsData?.map((admin: Admin) => (
                      <Tr key={admin._id}>
                        <Td fontWeight="bold">{admin.name}</Td>
                        <Td>{admin.email}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              admin.role === 'super_admin' ? 'red' : 'purple'
                            }
                          >
                            {admin.role === 'super_admin' ? (
                              <HStack>
                                <ShieldAlert size={12} />
                                <Text>Super Admin</Text>
                              </HStack>
                            ) : (
                              <HStack>
                                <Shield size={12} />
                                <Text>Admin</Text>
                              </HStack>
                            )}
                          </Badge>
                        </Td>
                        <Td>
                          {new Date(admin.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </Td>
                        <Td>
                          {isSuperAdmin && admin._id !== user?.id && (
                            <IconButton
                              aria-label="Delete admin"
                              icon={<Trash2 size={16} />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() =>
                                handleDeleteClick(admin._id, admin.name)
                              }
                            />
                          )}
                        </Td>
                      </Tr>
                    ))}
                    {adminsData?.length === 0 && (
                      <Tr>
                        <Td colSpan={5} textAlign="center">
                          No admins found.
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            )}
          </CardContent>
        </Card>
      </VStack>

      <DeleteAdminDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirmDelete}
        adminName={adminToDelete?.name || null}
      />
    </Box>
  );
}
