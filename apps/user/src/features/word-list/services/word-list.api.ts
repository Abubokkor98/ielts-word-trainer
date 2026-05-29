import { axiosInstance } from '@ielts/auth';
import type { WordList } from '../types';

export const wordListApi = {
  getLists: async (): Promise<WordList[]> => {
    const { data } = await axiosInstance.get<{ data: WordList[] }>('/word-lists');
    return data.data;
  },

  createList: async (name: string): Promise<WordList> => {
    const { data } = await axiosInstance.post<{ data: WordList }>('/word-lists', { name });
    return data.data;
  },

  renameList: async (listId: string, name: string): Promise<WordList> => {
    const { data } = await axiosInstance.patch<{ data: WordList }>(`/word-lists/${listId}`, {
      name,
    });
    return data.data;
  },

  deleteList: async (listId: string): Promise<void> => {
    await axiosInstance.delete(`/word-lists/${listId}`);
  },

  addWord: async (listId: string, wordId: string): Promise<WordList> => {
    const { data } = await axiosInstance.post<{ data: WordList }>(`/word-lists/${listId}/words`, {
      wordId,
    });
    return data.data;
  },

  removeWord: async (listId: string, wordId: string): Promise<void> => {
    await axiosInstance.delete(`/word-lists/${listId}/words/${wordId}`);
  },
};
