import axios from 'axios';
import { useAuthStore } from './auth.store';

const baseURL =
  process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3333/api/v1';

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 & Auto-refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for these endpoints - they return 401 intentionally
    const skipRefreshPaths = [
      '/auth/login',
      '/admin/login',
      '/users/change-password',
      '/admin/change-password',
      '/password/reset-password',
    ];

    const shouldSkipRefresh = skipRefreshPaths.some((path) =>
      originalRequest.url?.includes(path)
    );

    // Prevent infinite loops and skip refresh for intentional 401s
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh
    ) {
      originalRequest._retry = true;

      try {
        // Determine which refresh endpoint to use based on current path
        const isAdminPath = originalRequest.url?.includes('/admin');
        const refreshEndpoint = isAdminPath
          ? '/admin/refresh'
          : '/auth/refresh';

        // Attempt to refresh token
        const response = await axios.post(
          `${baseURL}${refreshEndpoint}`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;

        if (accessToken) {
          useAuthStore.getState().setToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const api = axiosInstance;
