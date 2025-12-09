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
} from '@chakra-ui/react';
import { Search, Mail, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function UserManagementPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');

  // Leveraging the existing stats endpoint which returns recent users slightly abused here
  // Ideally we need a dedicated /admin/users endpoint with pagination
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'], // Reusing stats for now as it has recent users
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/stats');
      return data.data;
    },
    enabled: !!user && user.role === 'admin',
  });

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">User Management</Heading>
          <Button variant="outline">Export Users</Button>
        </HStack>

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
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>User</Th>
                    <Th>Role</Th>
                    <Th>XP</Th>
                    <Th>Joined</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stats?.recentUsers?.map((u: any) => (
                    <Tr key={u._id}>
                      <Td>
                        <HStack>
                          <Avatar size="sm" name={u.name} src={u.avatar} />
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
                          colorScheme={u.role === 'admin' ? 'purple' : 'gray'}
                        >
                          {u.role || 'User'}
                        </Badge>
                      </Td>
                      <Td fontWeight="bold">{u.xp || 0}</Td>
                      <Td>
                        <HStack spacing={1} color="gray.500" fontSize="sm">
                          <Calendar size={14} />
                          <Text>
                            {new Date(u.createdAt).toLocaleDateString()}
                          </Text>
                        </HStack>
                      </Td>
                      <Td>
                        <Badge colorScheme="green">Active</Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardContent>
        </Card>
      </VStack>
    </Box>
  );
}
