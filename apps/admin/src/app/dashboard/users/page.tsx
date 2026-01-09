'use client';

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
  useDisclosure,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Input,
  Pagination,
} from '@ielts/ui';
import { useAuthStore } from '@ielts/auth';
import {
  Search,
  Mail,
  Calendar,
  Download,
  Eye,
  MoreVertical,
  Ban,
  CheckCircle,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@ielts/auth';
import { UserDetailModal } from './UserDetailModal';
import { User } from '../../../types/user';

export default function UserManagementPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const toast = useToast();
  const queryClient = useQueryClient();

  // Modal State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Ban Confirmation State
  const [isBanAlertOpen, setIsBanAlertOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<User | null>(null);
  const banCancelRef = useRef<HTMLButtonElement>(null);

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
    enabled: !!user && ['admin', 'super_admin'].includes(user.role),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: string;
      status: string;
    }) => {
      await axiosInstance.patch(`/admin/users/${userId}/status`, { status });
    },
    onSuccess: (_, variables) => {
      toast({
        title: `User ${variables.status === 'banned' ? 'banned' : 'activated'}`,
        status: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: () => {
      toast({ title: 'Failed to update user status', status: 'error' });
    },
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

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    updateStatusMutation.mutate({ userId, status: newStatus });
  };

  const handleBanUser = (user: User) => {
    setUserToBan(user);
    setIsBanAlertOpen(true);
  };

  const confirmBan = () => {
    if (userToBan) {
      handleStatusChange(userToBan._id, 'banned');
      setIsBanAlertOpen(false);
      setUserToBan(null);
    }
  };

  const closeBanAlert = () => {
    setIsBanAlertOpen(false);
    setUserToBan(null);
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
                <Box overflowX="auto" pb={4}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>User</Th>
                        <Th>Role</Th>
                        <Th>Status</Th>
                        <Th>XP</Th>
                        <Th>Joined</Th>
                        <Th>Action</Th>
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
                            <Td>
                              <Badge
                                variant="subtle"
                                colorScheme={
                                  u.status === 'active'
                                    ? 'green'
                                    : u.status === 'banned'
                                    ? 'red'
                                    : 'gray'
                                }
                              >
                                {u.status || 'Active'}
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
                            <Td>
                              <HStack spacing={2}>
                                <IconButton
                                  aria-label="View user details"
                                  icon={<Eye size={16} />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewUser(u)}
                                />
                                {u.status === 'banned' ? (
                                  <IconButton
                                    aria-label="Activate user"
                                    icon={<CheckCircle size={16} />}
                                    size="sm"
                                    colorScheme="green"
                                    variant="ghost"
                                    onClick={() =>
                                      handleStatusChange(u._id, 'active')
                                    }
                                  />
                                ) : (
                                  <IconButton
                                    aria-label="Ban user"
                                    icon={<Ban size={16} />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => handleBanUser(u)}
                                  />
                                )}
                              </HStack>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={6} textAlign="center" py={8}>
                            <Text color="gray.500">No users found</Text>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>

                <Pagination
                  currentPage={page}
                  totalPages={usersData?.pagination.totalPages || 1}
                  onPageChange={setPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </VStack>

      {/* User Detail Modal */}
      <UserDetailModal isOpen={isOpen} onClose={onClose} user={selectedUser} />

      {/* Ban Confirmation Dialog */}
      <AlertDialog
        isOpen={isBanAlertOpen}
        leastDestructiveRef={banCancelRef}
        onClose={closeBanAlert}
        isCentered
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(2px)">
          <AlertDialogContent borderRadius="xl" boxShadow="2xl">
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              color="red.500"
              pt={8}
              pb={0}
            >
              <VStack spacing={4}>
                <Text>Ban User</Text>
              </VStack>
            </AlertDialogHeader>

            <AlertDialogBody textAlign="center" color="gray.500" py={6}>
              Are you sure you want to ban <strong>{userToBan?.name}</strong>?{' '}
              <br />
              They will no longer be able to log in.
            </AlertDialogBody>

            <AlertDialogFooter justifyContent="center" pb={8} gap={3}>
              <Button
                ref={banCancelRef}
                onClick={closeBanAlert}
                variant="outline"
                borderRadius="lg"
                px={6}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmBan}
                borderRadius="lg"
                px={6}
              >
                Ban User
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
