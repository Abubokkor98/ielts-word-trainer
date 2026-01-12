export type AppType = 'user' | 'admin';

export interface AuthConfig {
  cookieName: string;
  refreshCookieName: string;
  allowedRoles: string[];
}

export const AUTH_CONFIG: Record<AppType, AuthConfig> = {
  user: {
    cookieName: 'accessToken',
    refreshCookieName: 'refreshToken', // Also standardizing this if safe, but user specifically asked for accessToken fix
    allowedRoles: ['user'],
  },
  admin: {
    cookieName: 'accessToken',
    refreshCookieName: 'refreshToken',
    allowedRoles: ['admin', 'superadmin'],
  },
};

export const getAuthConfig = (appType: AppType): AuthConfig => {
  return AUTH_CONFIG[appType];
};
