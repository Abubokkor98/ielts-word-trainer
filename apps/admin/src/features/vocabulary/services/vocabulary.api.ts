import { axiosInstance } from '@ielts/auth';
import type { WordsQueryParams, WordsResponse } from '../types';

interface UploadResponse {
  success: boolean;
  data: {
    total: number;
    successful: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
  };
  message: string;
}

export const vocabularyApi = {
  /**
   * Fetch words with pagination and filters
   */
  getWords: async (params: WordsQueryParams): Promise<WordsResponse> => {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    if (params.search) searchParams.append('search', params.search);
    if (params.difficulty && params.difficulty !== 'all') {
      searchParams.append('difficulty', params.difficulty);
    }

    const { data } = await axiosInstance.get(`/words?${searchParams.toString()}`);
    return data.data;
  },

  /**
   * Delete a word by ID
   */
  deleteWord: async (wordId: string): Promise<void> => {
    await axiosInstance.delete(`/words/${wordId}`);
  },

  /**
   * Upload CSV file with words
   */
  uploadCSV: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axiosInstance.post<UploadResponse>('/words/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  /**
   * Upload CSV file with words (atomic - all-or-nothing)
   */
  uploadCSVAtomic: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axiosInstance.post<UploadResponse>('/words/upload-atomic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
