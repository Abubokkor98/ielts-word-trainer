import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from './auth.store';

// Extend Axios config to support custom flags
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipErrorLogging?: boolean;
  _retry?: boolean;
}

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

// Public routes where we don't want to force a redirect to login
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
  '/vocabulary',
  '/quiz',
];

const isPublicRoute = (path: string) =>
  publicRoutes.some((route) =>
    route === '/'
      ? path === route
      : path === route || path.startsWith(`${route}/`)
  );

// Shared promise for refresh token to prevent concurrent refreshes
let refreshTokenPromise: Promise<string> | null = null;

const resetRefreshState = () => {
  refreshTokenPromise = null;
};

// Response interceptor: Handle 401 & Auto-refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

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

    // Check if we're in production mode
    const isProduction = process.env['NODE_ENV'] === 'production';

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh
    ) {
      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true;

      // If already refreshing, wait for that promise
      if (refreshTokenPromise) {
        try {
          const newToken = await refreshTokenPromise;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Start new refresh attempt
      refreshTokenPromise = (async () => {
        try {
          // Determine which refresh endpoint to use based on current path
          const isAdminPath =
            originalRequest.url?.startsWith('/admin/') ||
            originalRequest.url === '/admin';
          const refreshEndpoint = isAdminPath
            ? '/admin/refresh'
            : '/auth/refresh';

          // Attempt to refresh using cookie (the source of truth for sessions)
          const response = await axios.post(
            `${baseURL}${refreshEndpoint}`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = response.data;

          if (!accessToken) {
            throw new Error('Token refresh returned no access token');
          }

          // Update store
          useAuthStore.getState().setToken(accessToken);

          return accessToken;
        } catch (refreshError: any) {
          // Determine if we should logout based on error type
          // Only logout for authentication errors, not network/server errors
          const shouldLogout =
            refreshError.response?.status === 401 ||
            refreshError.response?.status === 403 ||
            refreshError.response?.data?.code === 'REFRESH_TOKEN_MISSING' ||
            refreshError.response?.data?.code === 'INVALID_REFRESH_TOKEN' ||
            refreshError.response?.data?.code === 'USER_NOT_FOUND' ||
            refreshError.response?.data?.code === 'USER_BANNED';

          if (shouldLogout) {
            // Only logout for authentication errors
            useAuthStore.getState().logout();

            if (typeof window !== 'undefined') {
              const currentPath = window.location.pathname;
              if (!isPublicRoute(currentPath)) {
                window.location.href = '/';
              }
            }
          }

          throw refreshError;
        } finally {
          // Reset state after refresh completes (success or failure)
          resetRefreshState();
        }
      })();

      try {
        const newToken = await refreshTokenPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Suppress production errors for client errors only
        if (
          isProduction &&
          error.response?.status >= 400 &&
          error.response?.status < 500
        ) {
          const silentError = new Error('Token refresh failed');
          Object.assign(silentError, {
            response: error.response,
            config: error.config,
          });
          return Promise.reject(silentError);
        }
        return Promise.reject(refreshError);
      }
    }

    // For all 4xx client errors (400-499), suppress in production
    // Keep 5xx server errors visible as they indicate bugs/issues
    const statusCode = error.response?.status;
    if (statusCode && statusCode >= 400 && statusCode < 500 && isProduction) {
      // Still reject the promise so error handling works
      // But create a clean error without axios logging
      const silentError = new Error(
        error.response?.data?.message || `Client error (${statusCode})`
      );
      Object.assign(silentError, {
        response: error.response,
        config: error.config,
        status: statusCode,
      });
      return Promise.reject(silentError);
    }

    return Promise.reject(error);
  }
);

export const api = axiosInstance;
