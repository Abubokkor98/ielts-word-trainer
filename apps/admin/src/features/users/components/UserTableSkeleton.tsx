import { Box, HStack, Skeleton, Td, Tr } from '@chakra-ui/react';

export const UserTableSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <Tr key={i}>
          {/* User (Avatar + Name + Email) */}
          <Td>
            <HStack>
              <Skeleton borderRadius="full" boxSize="32px" />
              <Box>
                <Skeleton height="16px" width="120px" mb={1} />
                <Skeleton height="12px" width="180px" />
              </Box>
            </HStack>
          </Td>
          {/* Status Badge */}
          <Td>
            <Skeleton height="24px" width="70px" borderRadius="md" />
          </Td>
          {/* XP */}
          <Td>
            <Skeleton height="20px" width="50px" />
          </Td>
          {/* Joined */}
          <Td>
            <HStack spacing={1}>
              <Skeleton height="14px" width="14px" />
              <Skeleton height="14px" width="90px" />
            </HStack>
          </Td>
          {/* Actions */}
          <Td>
            <HStack spacing={2}>
              <Skeleton height="32px" width="32px" borderRadius="md" />
              <Skeleton height="32px" width="32px" borderRadius="md" />
            </HStack>
          </Td>
        </Tr>
      ))}
    </>
  );
};
