import { axiosInstance } from '@ielts/auth';
import type { UsersQueryParams, UsersResponse } from '../types';

export const usersApi = {
  /**
   * Fetch users with pagination and search
   */
  getUsers: async (params: UsersQueryParams): Promise<UsersResponse> => {
    const { data } = await axiosInstance.get('/admin/users', {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.search && { search: params.search }),
      },
    });
    return data.data;
  },

  /**
   * Update user status (ban/activate)
   */
  updateUserStatus: async (
    userId: string,
    status: 'active' | 'banned'
  ): Promise<void> => {
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
