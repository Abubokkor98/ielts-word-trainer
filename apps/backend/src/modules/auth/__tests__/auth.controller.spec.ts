import type { Response } from 'express';
import { AuthController } from '../auth.controller';

// Mock the dependencies
jest.mock('../../../config/env', () => ({
  env: { JWT_SECRET: 'test-secret', NODE_ENV: 'production' },
}));

jest.mock('../../users/users.service');
jest.mock('../auth.service');

describe('AuthController - Cookie Configuration', () => {
  let mockRes: Partial<Response>;
  let cookieSpy: jest.Mock;

  beforeEach(() => {
    cookieSpy = jest.fn();
    mockRes = {
      cookie: cookieSpy,
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.COOKIE_DOMAIN;
  });

  describe('setAuthCookies in production', () => {
    it('should set cookies with correct attributes in production', () => {
      // Set production environment
      process.env.NODE_ENV = 'production';
      process.env.COOKIE_DOMAIN = '.vercel.app';

      // Access the private method via reflection
      const setAuthCookies = (AuthController as any).setAuthCookies;
      setAuthCookies(
        mockRes as Response,
        'test-access-token',
        'test-refresh-token'
      );

      // Verify accessToken cookie
      expect(cookieSpy).toHaveBeenCalledWith(
        'accessToken',
        'test-access-token',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/',
          domain: '.vercel.app',
          maxAge: 15 * 60 * 1000,
        })
      );

      // Verify refreshToken cookie
      expect(cookieSpy).toHaveBeenCalledWith(
        'refreshToken',
        'test-refresh-token',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/',
          domain: '.vercel.app',
          maxAge: 7 * 24 * 3600000,
        })
      );

      expect(cookieSpy).toHaveBeenCalledTimes(2);
    });

    it('should set cookies without domain in development', () => {
      // Set development environment
      process.env.NODE_ENV = 'development';
      delete process.env.COOKIE_DOMAIN;

      const setAuthCookies = (AuthController as any).setAuthCookies;
      setAuthCookies(
        mockRes as Response,
        'test-access-token',
        'test-refresh-token'
      );

      // Verify accessToken cookie
      expect(cookieSpy).toHaveBeenCalledWith(
        'accessToken',
        'test-access-token',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          domain: undefined,
          maxAge: 15 * 60 * 1000,
        })
      );

      // Verify refreshToken cookie
      expect(cookieSpy).toHaveBeenCalledWith(
        'refreshToken',
        'test-refresh-token',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          domain: undefined,
          maxAge: 7 * 24 * 3600000,
        })
      );
    });

    it('should use custom domain when COOKIE_DOMAIN is set', () => {
      process.env.NODE_ENV = 'production';
      process.env.COOKIE_DOMAIN = '.example.com';

      const setAuthCookies = (AuthController as any).setAuthCookies;
      setAuthCookies(
        mockRes as Response,
        'test-access-token',
        'test-refresh-token'
      );

      expect(cookieSpy).toHaveBeenCalledWith(
        'accessToken',
        'test-access-token',
        expect.objectContaining({
          domain: '.example.com',
        })
      );
    });
  });
});
