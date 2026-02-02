import {
  Avatar,
  Badge,
  Box,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Ban, Calendar, CheckCircle, Eye, Mail } from 'lucide-react';
import { UserTableSkeleton } from './UserTableSkeleton';
import type { User } from '../types';

interface UserTableProps {
  isLoading: boolean;
  users?: User[];
  onViewUser: (user: User) => void;
  onStatusChange: (userId: string, status: 'active' | 'banned') => void;
  onBanUser: (user: User) => void;
}

export function UserTable({
  isLoading,
  users,
  onViewUser,
  onStatusChange,
  onBanUser,
}: UserTableProps) {
  return (
    <Box overflowX="auto" pb={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th>Status</Th>
            <Th>XP</Th>
            <Th>Joined</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            <UserTableSkeleton />
          ) : users && users.length > 0 ? (
            users.map((u: User) => (
              <Tr key={u._id}>
                <Td>
                  <HStack>
                    <Avatar size="sm" name={u.name} />
                    <Box>
                      <Text fontWeight="600">{u.name}</Text>
                      <HStack spacing={1} color="gray.500" fontSize="xs">
                        <Mail size={12} />
                        <Text>{u.email}</Text>
                      </HStack>
                    </Box>
                  </HStack>
                </Td>

                <Td>
                  <Badge
                    variant="subtle"
                    colorScheme={
                      u.status === 'active'
                        ? 'green'
                        : u.status === 'banned'
                        ? 'red'
                        : 'green'
                    }
                  >
                    {u.status === 'banned' ? 'Banned' : 'Active'}
                  </Badge>
                </Td>
                <Td fontWeight="bold">{u.xp || 0}</Td>
                <Td>
                  <HStack spacing={1} color="gray.500" fontSize="sm">
                    <Calendar size={14} />
                    <Text>{new Date(u.createdAt).toLocaleDateString()}</Text>
                  </HStack>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="View user details"
                      icon={<Eye size={16} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewUser(u)}
                    />
                    {u.status === 'banned' ? (
                      <IconButton
                        aria-label="Activate user"
                        icon={<CheckCircle size={16} />}
                        size="sm"
                        colorScheme="green"
                        variant="ghost"
                        onClick={() => onStatusChange(u._id, 'active')}
                      />
                    ) : (
                      <IconButton
                        aria-label="Ban user"
                        icon={<Ban size={16} />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => onBanUser(u)}
                      />
                    )}
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
  );
}
