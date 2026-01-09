import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Stat,
  Box,
  Divider,
  useColorModeValue,
  Grid,
  GridItem,
  Icon,
} from '@chakra-ui/react';
import {
  Mail,
  Calendar,
  Award,
  Flame,
  User as UserIcon,
  Shield,
} from 'lucide-react';
import { User } from '../../../types/user';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserDetailModal({
  isOpen,
  onClose,
  user,
}: UserDetailModalProps) {
  const bgCard = useColorModeValue('white', 'gray.800');
  const bgStats = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent
        bg={bgCard}
        borderRadius="2xl"
        boxShadow="xl"
        overflow="hidden"
      >
        <ModalCloseButton zIndex={10} color="white" />

        {/* Helper Banner for premium feel */}
        <Box
          h="100px"
          bgGradient="linear(to-r, brand.500, brand.600)"
          position="relative"
        >
          <Box
            position="absolute"
            bottom="-40px"
            left="50%"
            transform="translateX(-50%)"
          >
            <Avatar
              size="2xl"
              name={user.name}
              src={user.avatar}
              border="4px solid"
              borderColor={bgCard}
              bg="brand.500"
              color="white"
              showBorder
            />
          </Box>
        </Box>

        <ModalBody pt={12} pb={8} px={8}>
          <VStack spacing={6}>
            {/* User Info Header */}
            <VStack spacing={1} mt={2}>
              <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                {user.name}
              </Text>
              <HStack color={textColor} fontSize="sm">
                <Mail size={14} />
                <Text>{user.email}</Text>
              </HStack>

              <HStack spacing={2} mt={2}>
                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  colorScheme={user.role === 'admin' ? 'purple' : 'blue'}
                  variant="subtle"
                >
                  {user.role || 'USER'}
                </Badge>
                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  colorScheme={
                    user.status === 'active'
                      ? 'green'
                      : user.status === 'banned'
                      ? 'red'
                      : 'gray'
                  }
                  variant="subtle"
                >
                  {user.status || 'active'}
                </Badge>
              </HStack>
            </VStack>

            <Divider borderColor={useColorModeValue('gray.100', 'gray.700')} />

            {/* Stats Grid */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
              <GridItem>
                <Box
                  bg={bgStats}
                  p={4}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={useColorModeValue('gray.100', 'gray.600')}
                  textAlign="center"
                >
                  <Icon as={Award} w={6} h={6} color="brand.500" mb={2} />
                  <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                    {user.xp || 0}
                  </Text>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    color="gray.500"
                  >
                    Total XP
                  </Text>
                </Box>
              </GridItem>
              <GridItem>
                <Box
                  bg={bgStats}
                  p={4}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={useColorModeValue('gray.100', 'gray.600')}
                  textAlign="center"
                >
                  <Icon as={Flame} w={6} h={6} color="orange.400" mb={2} />
                  <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                    {user.streak || 0}
                  </Text>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    color="gray.500"
                  >
                    Streak Days
                  </Text>
                </Box>
              </GridItem>
            </Grid>

            {/* Timestamps */}
            <VStack
              w="full"
              bg={useColorModeValue('gray.50', 'gray.700')}
              p={4}
              borderRadius="lg"
              align="start"
              spacing={3}
            >
              <HStack color={textColor} fontSize="sm">
                <Icon as={Calendar} size={16} />
                <Text fontWeight="medium">Member Since:</Text>
                <Text>
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </HStack>
              {user.lastQuizDate && (
                <HStack color={textColor} fontSize="sm">
                  <Icon as={Award} size={16} />
                  <Text fontWeight="medium">Last Activity:</Text>
                  <Text>
                    {new Date(user.lastQuizDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </HStack>
              )}
              <HStack color={textColor} fontSize="sm">
                <Icon as={Shield} size={16} />
                <Text fontWeight="medium">Account Status:</Text>
                <Text
                  textTransform="capitalize"
                  color={user.status === 'banned' ? 'red.500' : 'inherit'}
                >
                  {user.status === 'banned'
                    ? 'Restricted (Banned)'
                    : 'Good Standing'}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
