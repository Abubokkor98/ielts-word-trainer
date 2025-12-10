'use client';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance, useAuthStore } from '@ielts/auth';
import { Card, CardHeader, CardContent, Button, Input } from '@ielts/ui';
import {
  Box,
  Heading,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  Skeleton,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Search, Mail, Calendar, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  xp?: number;
  createdAt: string;
}

export default function UserManagementPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const toast = useToast();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const {
    data: usersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'users', page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const { data } = await axiosInstance.get(
        `/admin/users?${params.toString()}`
      );
      return data.data;
    },
    enabled: !!user && user.role === 'admin',
  });

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get('/admin/users/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Export successful', status: 'success' });
    } catch (error) {
      toast({ title: 'Export failed', status: 'error' });
    }
  };

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">User Management</Heading>
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
            onClick={handleExport}
          >
            Export Users
          </Button>
        </HStack>

        {isError && (
          <Text color="red.500">
            Failed to load users. Please try again later.
          </Text>
        )}

        <Card>
          <CardHeader>
            <Box position="relative" maxW="400px">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                pl={10}
              />
              <Box
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                color="gray.400"
              >
                <Search size={16} />
              </Box>
            </Box>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <VStack spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height="60px" />
                ))}
              </VStack>
            ) : (
              <>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>User</Th>
                        <Th>Role</Th>
                        <Th>XP</Th>
                        <Th>Joined</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {usersData?.users?.length ? (
                        usersData.users.map((u: User) => (
                          <Tr key={u._id}>
                            <Td>
                              <HStack>
                                <Avatar
                                  size="sm"
                                  name={u.name}
                                  src={u.avatar}
                                />
                                <Box>
                                  <Text fontWeight="600">{u.name}</Text>
                                  <HStack
                                    spacing={1}
                                    color="gray.500"
                                    fontSize="xs"
                                  >
                                    <Mail size={12} />
                                    <Text>{u.email}</Text>
                                  </HStack>
                                </Box>
                              </HStack>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  u.role === 'admin' ? 'purple' : 'gray'
                                }
                              >
                                {u.role || 'User'}
                              </Badge>
                            </Td>
                            <Td fontWeight="bold">{u.xp || 0}</Td>
                            <Td>
                              <HStack
                                spacing={1}
                                color="gray.500"
                                fontSize="sm"
                              >
                                <Calendar size={14} />
                                <Text>
                                  {new Date(u.createdAt).toLocaleDateString()}
                                </Text>
                              </HStack>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={5} textAlign="center" py={8}>
                            <Text color="gray.500">No users found</Text>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>

                <HStack justify="center" mt={6} spacing={4}>
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    isDisabled={page === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Text fontSize="sm" color="gray.500">
                    Page {page} of {usersData?.pagination.totalPages || 1}
                  </Text>
                  <Button
                    onClick={() =>
                      setPage((p) =>
                        Math.min(usersData?.pagination.totalPages || 1, p + 1)
                      )
                    }
                    isDisabled={page === usersData?.pagination.totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </HStack>
              </>
            )}
          </CardContent>
        </Card>
      </VStack>
    </Box>
  );
}
