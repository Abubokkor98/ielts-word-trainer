import type { Response } from 'express';

/**
 * Get cookie options for authentication cookies
 * Ensures consistent cookie configuration across all auth operations
 */
export const getAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

  const baseOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    domain: cookieDomain,
  };

  // Add partitioned attribute for production (required for sameSite: none in modern browsers)
  // This prevents cookies from being silently rejected in cross-origin contexts
  if (isProduction) {
    return {
      ...baseOptions,
      partitioned: true,
    } as any; // Express types don't include partitioned yet
  }

  return baseOptions;
};

/**
 * Set authentication cookies (access token and refresh token)
 */
export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  const options = getAuthCookieOptions();

  res.cookie('accessToken', accessToken, {
    ...options,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    ...options,
    maxAge: 7 * 24 * 3600000, // 7 days
  });
};

/**
 * Clear authentication cookies
 * CRITICAL: Must use same options as when cookies were set
 * Otherwise browsers won't clear cookies in production
 */
export const clearAuthCookies = (res: Response) => {
  const options = getAuthCookieOptions();
  res.clearCookie('accessToken', options);
  res.clearCookie('refreshToken', options);
};
