import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Assume backend cookie renewal handles this automatically on a specific endpoint
        // OR simply retry if we just needed to refresh cookie via a call
        // Here we just trigger a verify call or similar if needed.
        // With httpOnly cookies, the browser sends them.
        // If access token is in header, we refresh it here.
        // In our current design: AccessToken is in response body, so we might need to store it in memory/context.
        // For simplicity with cookies-only-ish flow or hybrid:
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
