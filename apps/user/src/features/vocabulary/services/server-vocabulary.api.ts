import type { VocabularyResponse, Word } from '../types';

// Server-only env var — always absolute, never exposed to client bundle
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3333/api/v1';

const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds to accommodate Vercel cold starts and concurrent build requests

const fetchWithTimeout = (
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> => {
  return fetch(input, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
  });
};

export const serverVocabularyApi = {
  /**
   * Fetches dynamic route parameter entries (e.g. paginated words) on the server.
   * Leverages Next.js fetch cache configuration to optimize build runs.
   */
  getWords: async (page = 1, limit = 100): Promise<Word[]> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/words?page=${page}&limit=${limit}`, {
        next: { revalidate: 86400 }, // Cache lookups for 24 hours
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch words list: ${response.statusText}`);
      }

      const payload = await response.json();
      return payload.data?.words || [];
    } catch (error) {
      console.error('Error fetching words in serverVocabularyApi:', error);
      return [];
    }
  },

  /**
   * Fetches a paginated response matching the client-side VocabularyResponse shape.
   * Used by HydrationBoundary prefetching so the cache aligns with useQuery on the client.
   */
  getWordsPage: async (page = 1, limit = 12): Promise<VocabularyResponse> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/words?page=${page}&limit=${limit}`, {
        next: { revalidate: 60 }, // Match client staleTime (60s)
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch words page: ${response.statusText}`);
      }

      const payload = await response.json();
      return payload.data || { words: [], totalPages: 1, totalWords: 0, currentPage: page };
    } catch (error) {
      console.error('Error prefetching words page:', error);
      return { words: [], totalPages: 1, totalWords: 0, currentPage: page };
    }
  },

  /**
   * Fetches detail for a single word by MongoDB ID.
   * Leverages revalidation logic for dynamic route static cache rendering.
   */
  getWordById: async (id: string): Promise<Word | null> => {
    try {
      const encodedId = encodeURIComponent(id);
      const response = await fetchWithTimeout(`${API_BASE_URL}/words/${encodedId}`, {
        next: { revalidate: 86400 }, // Cache dynamic pages for 24 hours
      });

      if (!response.ok) {
        return null;
      }

      const payload = await response.json();
      return payload.data || null;
    } catch (error) {
      console.error(`Error fetching word ID ${id} in serverVocabularyApi:`, error);
      return null;
    }
  },
};
