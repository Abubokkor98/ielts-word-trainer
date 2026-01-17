import { axiosInstance } from '@ielts/auth';
import type {
  AuthResponse,
  ForgotPasswordCredentials,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/register', credentials);
    return data;
  },

  forgotPassword: async (credentials: ForgotPasswordCredentials): Promise<void> => {
    await axiosInstance.post('/password/request-reset', credentials);
  },

  resetPassword: async (credentials: ResetPasswordCredentials): Promise<void> => {
    await axiosInstance.post('/password/reset-password', {
      token: credentials.token,
      password: credentials.password,
    });
  },

  getMe: async (config?: { skipErrorLogging?: boolean }): Promise<AuthResponse['data']> => {
    const { data } = await axiosInstance.get<{
      success: boolean;
      data: AuthResponse['data'];
    }>('/auth/me', config as any);
    return data.data;
  },
};
