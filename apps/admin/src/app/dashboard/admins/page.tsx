'use client';

import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import { Card, CardContent } from '@ielts/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Admin } from 'apps/admin/src/types/admin';
import { Plus, Shield, ShieldAlert, Trash2 } from 'lucide-react';

export default function AdminManagementPage() {
  const { user } = useAuthStore();
  const toast = useToast();
  const queryClient = useQueryClient();
  const isSuperAdmin = user?.role === 'super_admin';

  const {
    data: adminsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'admins'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/admins');
      return data.data; // Assuming controller returns { success: true, data: [...] }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/admin/admins/${id}`);
    },
    onSuccess: () => {
      toast({ title: 'Admin deleted successfully', status: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'admins'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete admin',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      deleteMutation.mutate(id);
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

        {isError && <Text color="red.500">Failed to load admins.</Text>}

        <Card>
          <CardContent>
            {isLoading ? (
              <VStack spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height="50px" />
                ))}
              </VStack>
            ) : (
              <Box overflowX="auto" pb={4}>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Role</Th>
                      <Th>Created At</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {adminsData?.map((admin: Admin) => (
                      <Tr key={admin._id}>
                        <Td fontWeight="bold">{admin.name}</Td>
                        <Td>{admin.email}</Td>
                        <Td>
                          <Badge colorScheme={admin.role === 'super_admin' ? 'red' : 'purple'}>
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
                        <Td>{new Date(admin.createdAt).toLocaleDateString()}</Td>
                        <Td>
                          {isSuperAdmin && admin._id !== user?.id && (
                            <IconButton
                              aria-label="Delete admin"
                              icon={<Trash2 size={16} />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleDelete(admin._id)}
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
    </Box>
  );
}
