'use client';

import { Box, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { Card, CardContent, Pagination } from '@ielts/ui';
import { useEffect, useState } from 'react';
import { BanUserDialog } from './components/BanUserDialog';
import { UserDetailModal } from './components/UserDetailModal';
import { UserHeader } from './components/UserHeader';
import { UserSearch } from './components/UserSearch';
import { UserTable } from './components/UserTable';
import { useUserManagement, useUsers } from './hooks/use-users';
import type { User } from './types';

export function UsersContainer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modal State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Ban Confirmation State
  const [isBanAlertOpen, setIsBanAlertOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<User | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch users
  const {
    data: usersData,
    isLoading,
    isError,
  } = useUsers({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  // User management
  const { updateStatus, exportUsers } = useUserManagement();

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleStatusChange = (
    userId: string,
    newStatus: 'active' | 'banned'
  ) => {
    updateStatus.mutate({ userId, status: newStatus });
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
        <UserHeader onExport={exportUsers} />

        {isError && (
          <Text color="red.500">
            Failed to load users. Please try again later.
          </Text>
        )}

        <Card>
          <UserSearch search={search} onSearchChange={setSearch} />

          <CardContent>
            <UserTable
              isLoading={isLoading}
              users={usersData?.users}
              onViewUser={handleViewUser}
              onStatusChange={handleStatusChange}
              onBanUser={handleBanUser}
            />

            {!isLoading && usersData?.users && usersData.users.length > 0 && (
              <Pagination
                currentPage={page}
                totalPages={usersData?.pagination.totalPages || 1}
                onPageChange={setPage}
              />
            )}
          </CardContent>
        </Card>
      </VStack>

      {/* User Detail Modal */}
      <UserDetailModal isOpen={isOpen} onClose={onClose} user={selectedUser} />

      {/* Ban Confirmation Dialog */}
      <BanUserDialog
        isOpen={isBanAlertOpen}
        onClose={closeBanAlert}
        onConfirm={confirmBan}
        user={userToBan}
      />
    </Box>
  );
}
