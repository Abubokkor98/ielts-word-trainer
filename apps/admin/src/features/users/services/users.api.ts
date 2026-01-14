import { axiosInstance } from '@ielts/auth';
import type { UsersQueryParams, UsersResponse } from '../types';

export const usersApi = {
  /**
   * Fetch users with pagination and search
   */
  getUsers: async (params: UsersQueryParams): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });
    if (params.search) searchParams.append('search', params.search);

    const { data } = await axiosInstance.get(
      `/admin/users?${searchParams.toString()}`
    );
    return data.data;
  },

  /**
   * Update user status (ban/activate)
   */
  updateUserStatus: async (userId: string, status: string): Promise<void> => {
    await axiosInstance.patch(`/admin/users/${userId}/status`, { status });
  },

  /**
   * Export users to CSV
   */
  exportUsers: async (): Promise<Blob> => {
    const response = await axiosInstance.get('/admin/users/export', {
      responseType: 'blob',
    });
    return response.data;
  },
};
