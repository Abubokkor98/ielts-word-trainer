import { axiosInstance } from '@ielts/auth';
import { VocabularyFilters, VocabularyResponse } from '../types';

export const vocabularyApi = {
  getWords: async (filters: VocabularyFilters): Promise<VocabularyResponse> => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: (filters.limit || 12).toString(),
    });

    if (filters.difficulty !== 'all') {
      params.append('difficulty', filters.difficulty);
    }

    if (filters.search) {
      params.append('search', filters.search);
    }

    if (filters.topic) {
      params.append('topicName', filters.topic);
    }

    const { data } = await axiosInstance.get<{ data: VocabularyResponse }>(
      `/words?${params.toString()}`
    );
    return data.data;
  },

  getWordById: async (id: string) => {
    const { data } = await axiosInstance.get(`/words/${id}`);
    return data.data;
  },
};
