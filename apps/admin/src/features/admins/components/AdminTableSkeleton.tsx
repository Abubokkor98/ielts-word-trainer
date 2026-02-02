import { Box, HStack, Skeleton, Td, Tr } from '@chakra-ui/react';

export function AdminTableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <Tr key={i}>
          {/* Name */}
          <Td>
            <Skeleton height="16px" width="140px" />
          </Td>
          {/* Email */}
          <Td>
            <Skeleton height="16px" width="200px" />
          </Td>
          {/* Role Badge */}
          <Td>
            <Skeleton height="24px" width="100px" borderRadius="md" />
          </Td>
          {/* Created At */}
          <Td>
            <Skeleton height="16px" width="100px" />
          </Td>
          {/* Actions */}
          <Td>
            <Skeleton height="32px" width="32px" borderRadius="md" />
          </Td>
        </Tr>
      ))}
    </>
  );
}
