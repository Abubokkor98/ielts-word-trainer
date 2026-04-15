'use client';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Collapse,
  Heading,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { BookOpen, ChevronDown, ChevronRight, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Word } from '../../vocabulary/types';
import type { WordList } from '../types';
import { useDeleteList, useRemoveWord, useRenameList } from '../hooks/use-word-lists';

interface ListCardProps {
  list: WordList;
  onViewDetails: (word: Word) => void;
}

const DIFFICULTY_DOT_COLORS: Record<string, string> = {
  beginner: 'green.400',
  intermediate: 'blue.400',
  advanced: 'purple.400',
};

export function ListCard({ list, onViewDetails }: ListCardProps) {
  const renameList = useRenameList();
  const deleteList = useDeleteList();
  const removeWord = useRemoveWord();
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(list.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartRename = () => {
    setEditName(list.name);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveRename = async () => {
    const trimmedName = editName.trim();
    if (!trimmedName || trimmedName === list.name) {
      setIsEditing(false);
      return;
    }

    try {
      await renameList.mutateAsync({ listId: list._id, name: trimmedName });
      setIsEditing(false);
      toast({
        title: 'List renamed',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Failed to rename list',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancelRename = () => {
    setEditName(list.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteList.mutateAsync(list._id);
      onDeleteClose();
      toast({
        title: `"${list.name}" deleted`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Failed to delete list',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveWord = async (wordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeWord.mutateAsync({ listId: list._id, wordId });
    } catch {
      toast({
        title: 'Failed to remove word',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box>
      {/* Section Header */}
      <HStack
        justify="space-between"
        py={2.5}
        px={1}
        cursor="pointer"
        _hover={{ bg: 'whiteAlpha.50' }}
        borderRadius="lg"
        transition="background 0.15s"
        onClick={onToggle}
      >
        <HStack spacing={3} flex={1} minW={0}>
          <Box color="gray.500" transition="transform 0.2s">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Box>

          {isEditing ? (
            <Input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveRename}
              onClick={(e) => e.stopPropagation()}
              size="sm"
              bg="gray.800"
              borderColor="gray.600"
              borderRadius="lg"
              _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
              maxW="240px"
            />
          ) : (
            <HStack spacing={2}>
              <Heading size="sm" color="gray.200" fontWeight="600" noOfLines={1}>
                {list.name}
              </Heading>
              <Text fontSize="xs" color="gray.600">
                {list.words.length}
              </Text>
            </HStack>
          )}
        </HStack>

        <Menu>
          <MenuButton
            as={IconButton}
            icon={<MoreHorizontal size={15} />}
            variant="ghost"
            size="xs"
            color="gray.600"
            _hover={{ color: 'gray.300', bg: 'whiteAlpha.100' }}
            aria-label="List actions"
            borderRadius="lg"
            onClick={(e) => e.stopPropagation()}
          />
          <MenuList
            bg="gray.800"
            borderColor="gray.700"
            borderRadius="xl"
            boxShadow="0 8px 32px rgba(0,0,0,0.4)"
            minW="140px"
            py={1}
          >
            <MenuItem
              icon={<Pencil size={13} />}
              onClick={(e) => {
                e.stopPropagation();
                handleStartRename();
              }}
              bg="gray.800"
              _hover={{ bg: 'whiteAlpha.100' }}
              fontSize="sm"
            >
              Rename
            </MenuItem>
            <MenuItem
              icon={<Trash2 size={13} />}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteOpen();
              }}
              bg="gray.800"
              _hover={{ bg: 'whiteAlpha.100' }}
              color="red.400"
              fontSize="sm"
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* Collapsible Content */}
      <Collapse in={isOpen} animateOpacity>
        <Box pl={8} pr={1} pb={3} pt={1}>
          {list.words.length === 0 ? (
            <HStack spacing={2} color="gray.600" py={1}>
              <BookOpen size={14} />
              <Text fontSize="sm">Empty - save words from Vocabulary</Text>
            </HStack>
          ) : (
            <Wrap spacing={2}>
              {list.words.map((word) => (
                <WrapItem key={word._id}>
                  <HStack
                    bg="gray.800"
                    pl={3}
                    pr={1.5}
                    py={1.5}
                    borderRadius="full"
                    spacing={2}
                    cursor="pointer"
                    role="group"
                    transition="all 0.15s"
                    _hover={{ bg: 'gray.700' }}
                    onClick={() => onViewDetails(word)}
                  >
                    <Box
                      w="6px"
                      h="6px"
                      borderRadius="full"
                      bg={DIFFICULTY_DOT_COLORS[word.difficulty] || 'gray.500'}
                      flexShrink={0}
                    />
                    <Text fontSize="sm" color="gray.200" fontWeight="500">
                      {word.word}
                    </Text>
                    <IconButton
                      aria-label="Remove word"
                      icon={<X size={11} />}
                      size="xs"
                      variant="ghost"
                      color="gray.600"
                      minW="20px"
                      h="20px"
                      opacity={0}
                      _groupHover={{ opacity: 1 }}
                      _focusVisible={{ opacity: 1 }}
                      _hover={{ color: 'red.400', bg: 'whiteAlpha.200' }}
                      borderRadius="full"
                      transition="all 0.15s"
                      onClick={(e) => handleRemoveWord(word._id, e)}
                    />
                  </HStack>
                </WrapItem>
              ))}
            </Wrap>
          )}
        </Box>
      </Collapse>
    </Box>

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" borderColor="gray.700" borderWidth="1px">
            <AlertDialogHeader fontSize="lg" fontWeight="600" color="white">
              Delete List
            </AlertDialogHeader>
            <AlertDialogBody color="gray.300">
              Are you sure you want to delete &quot;{list.name}&quot;? This will remove all saved words from this list.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost" size="sm">
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                size="sm"
                isLoading={deleteList.isPending}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
