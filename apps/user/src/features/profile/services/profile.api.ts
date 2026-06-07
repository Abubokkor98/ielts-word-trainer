import { axiosInstance } from '@ielts/auth';
import type { ChangePasswordRequest, UpdateProfileRequest, UserProfile } from '../types';

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await axiosInstance.get<{
      data: UserProfile & { _id: string };
    }>('/users/profile');
    return { ...data.data, id: data.data._id };
  },

  updateProfile: async (payload: UpdateProfileRequest): Promise<UserProfile> => {
    const { data } = await axiosInstance.patch<{
      data: UserProfile & { _id: string };
    }>('/users/profile', payload);
    return { ...data.data, id: data.data._id };
  },

  deleteProfilePicture: async (): Promise<void> => {
    await axiosInstance.delete('/users/picture');
  },

  getCloudinarySignature: async (): Promise<{ signature: string; timestamp: number; publicId: string }> => {
    const { data } = await axiosInstance.post<{ signature: string; timestamp: number; publicId: string }>('/users/cloudinary-signature');
    return data;
  },

  changePassword: async (payload: Omit<ChangePasswordRequest, 'confirm'>): Promise<void> => {
    await axiosInstance.post('/users/change-password', {
      currentPassword: payload.current,
      newPassword: payload.new,
    });
  },
};
