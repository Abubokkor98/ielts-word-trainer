import { NextRequest, NextResponse } from 'next/server';
import { proxy } from '../proxy';

describe('Admin Proxy Middleware', () => {
  describe('Protected Routes', () => {
    it('should redirect /dashboard to login when no refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/dashboard');
      const response = proxy(request);

      expect(response.status).toBe(307); // Redirect
      expect(response.headers.get('location')).toContain(
        '/login?redirect=%2Fdashboard'
      );
    });

    it('should allow /dashboard when refreshToken exists', () => {
      const request = new NextRequest('http://localhost:3001/dashboard');
      request.cookies.set('refreshToken', 'fake-refresh-token');

      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });

    it('should redirect /admins to login when no refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/admins');
      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain(
        '/login?redirect=%2Fadmins'
      );
    });

    it('should redirect /users to login when no refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/users');
      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain(
        '/login?redirect=%2Fusers'
      );
    });

    it('should redirect /settings to login when no refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/settings');
      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain(
        '/login?redirect=%2Fsettings'
      );
    });

    it('should redirect /problem-words to login when no refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/problem-words');
      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain(
        '/login?redirect=%2Fproblem-words'
      );
    });

    it('should redirect /vocabulary to login when no refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/vocabulary');
      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain(
        '/login?redirect=%2Fvocabulary'
      );
    });
  });

  describe('Auth Routes', () => {
    it('should redirect /login to dashboard if user has refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/login');
      request.cookies.set('refreshToken', 'fake-refresh-token');

      const response = proxy(request);

      expect(response.status).toBe(307); // Redirect
      expect(response.headers.get('location')).toContain('/dashboard');
    });

    it('should allow /login if user has no refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/login');
      // No token cookie

      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });

    it('should redirect /forgot-password to dashboard if user has refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/forgot-password');
      request.cookies.set('refreshToken', 'fake-refresh-token');

      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/dashboard');
    });

    it('should allow /forgot-password if user has no refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/forgot-password');

      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });

    it('should redirect /reset-password to dashboard if user has refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/reset-password');
      request.cookies.set('refreshToken', 'fake-refresh-token');

      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/dashboard');
    });

    it('should allow /reset-password if user has no refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/reset-password');

      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });
  });

  describe('Public Routes', () => {
    it('should allow home page to pass through', () => {
      const request = new NextRequest('http://localhost:3001/');
      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });

    it('should allow home page to pass through even with refreshToken', () => {
      const request = new NextRequest('http://localhost:3001/');
      request.cookies.set('refreshToken', 'fake-refresh-token');

      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });
  });

  describe('Middleware Header', () => {
    it('should set x-middleware-passed header on all non-redirected requests', () => {
      const routes = [
        { path: '/', hasToken: false },
        { path: '/login', hasToken: false },
        { path: '/forgot-password', hasToken: false },
        { path: '/dashboard', hasToken: true },
        { path: '/admins', hasToken: true },
      ];

      routes.forEach(({ path, hasToken }) => {
        const request = new NextRequest(`http://localhost:3001${path}`);
        if (hasToken) {
          request.cookies.set('refreshToken', 'fake-refresh-token');
        }

        const response = proxy(request);

        if (response.status !== 307) {
          expect(response.headers.get('x-middleware-passed')).toBe('true');
        }
      });
    });
  });

  describe('Cookie Validation', () => {
    it('should NOT recognize admin_auth_token cookie (deprecated)', () => {
      const request = new NextRequest('http://localhost:3001/dashboard');
      // Set old cookie that should no longer work
      request.cookies.set('admin_auth_token', 'fake-old-token');

      const response = proxy(request);

      // Should redirect to login because we only check refreshToken now
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/login');
    });

    it('should only recognize refreshToken cookie', () => {
      const request = new NextRequest('http://localhost:3001/dashboard');
      request.cookies.set('refreshToken', 'fake-refresh-token');

      const response = proxy(request);

      // Should NOT redirect
      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });
  });
});
