import { Flex, Skeleton, Td, Tr } from '@chakra-ui/react';

export function ProblemWordsTableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <Tr key={i}>
          {/* Word */}
          <Td>
            <Skeleton height="20px" width="120px" />
          </Td>
          {/* Meaning */}
          <Td>
            <Skeleton height="20px" width="200px" />
          </Td>
          {/* Difficulty */}
          <Td>
            <Skeleton height="24px" width="80px" borderRadius="md" />
          </Td>
          {/* Accuracy */}
          <Td isNumeric>
            <Flex justify="flex-end">
              <Skeleton height="24px" width="60px" borderRadius="md" />
            </Flex>
          </Td>
          {/* Attempts */}
          <Td isNumeric>
            <Flex justify="flex-end">
              <Skeleton height="20px" width="40px" />
            </Flex>
          </Td>
          {/* Last Updated */}
          <Td>
            <Skeleton height="20px" width="100px" />
          </Td>
        </Tr>
      ))}
    </>
  );
}
