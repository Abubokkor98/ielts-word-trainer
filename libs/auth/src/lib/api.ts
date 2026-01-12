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

// Queue to store pending requests during refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
      '/auth/logout',
    ];

    const shouldSkipRefresh = skipRefreshPaths.some((path) =>
      originalRequest.url?.includes(path)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

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

          processQueue(null, accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Refresh failed - logout user
        useAuthStore.getState().logout();

        if (typeof window !== 'undefined') {
          // Public routes where we don't want to force a redirect to login
          // matches proxy.ts configuration
          const publicRoutes = [
            '/login',
            '/register',
            '/forgot-password',
            '/reset-password',
            '/',
            '/vocabulary',
            '/quiz',
          ];

          const currentPath = window.location.pathname;
          // Check if current path matches any public route (exact match or sub-path)
          // We use simple matching here. For exact routes like '/', we match exactly.
          // For nested routes like '/vocabulary', we check startWith.
          const isPublic = publicRoutes.some((route) =>
            route === '/'
              ? currentPath === route
              : currentPath.startsWith(route)
          );

          if (!isPublic) {
            window.location.href = '/';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const api = axiosInstance;
