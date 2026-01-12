import { axiosInstance } from '@ielts/auth';
import type { ChangePasswordRequest, UpdateProfileRequest, UserProfile } from '../types';

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await axiosInstance.get<{ data: any }>('/users/profile');
    return { ...data.data, id: data.data._id };
  },

  updateProfile: async (payload: UpdateProfileRequest): Promise<UserProfile> => {
    const { data } = await axiosInstance.patch<{ data: any }>('/users/profile', payload);
    return { ...data.data, id: data.data._id };
  },

  changePassword: async (payload: Omit<ChangePasswordRequest, 'confirm'>): Promise<void> => {
    await axiosInstance.post('/users/change-password', {
      currentPassword: payload.current,
      newPassword: payload.new,
    });
  },
};
