export type AppType = 'user' | 'admin';

export interface AuthConfig {
  cookieName: string;
  refreshCookieName: string;
  allowedRoles: string[];
}

export const AUTH_CONFIG: Record<AppType, AuthConfig> = {
  user: {
    cookieName: 'user_auth_token',
    refreshCookieName: 'user_refresh_token',
    allowedRoles: ['user'],
  },
  admin: {
    cookieName: 'admin_auth_token',
    refreshCookieName: 'admin_refresh_token',
    allowedRoles: ['admin'],
  },
};

export const getAuthConfig = (appType: AppType): AuthConfig => {
  return AUTH_CONFIG[appType];
};
