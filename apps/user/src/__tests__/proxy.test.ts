import { NextRequest, NextResponse } from 'next/server';
import { proxy } from '../proxy';

describe('Proxy Middleware', () => {
  describe('Protected Routes', () => {
    it('should NOT redirect protected routes to login', () => {
      const request = new NextRequest('http://localhost:3000/dashboard');
      const response = proxy(request);

      // Should pass through, not redirect
      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307); // Not a redirect
    });

    it('should allow /profile route to pass through', () => {
      const request = new NextRequest('http://localhost:3000/profile');
      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });

    it('should allow /analytics route to pass through', () => {
      const request = new NextRequest('http://localhost:3000/analytics');
      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });

    it('should allow /review route to pass through', () => {
      const request = new NextRequest('http://localhost:3000/review');
      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });
  });

  describe('Auth Routes', () => {
    it('should redirect /login to dashboard if user has token', () => {
      const request = new NextRequest('http://localhost:3000/login');
      // Simulate having a token cookie
      request.cookies.set('accessToken', 'fake-token');

      const response = proxy(request);

      expect(response.status).toBe(307); // Redirect
      expect(response.headers.get('location')).toContain('/dashboard');
    });

    it('should allow /login if user has no token', () => {
      const request = new NextRequest('http://localhost:3000/login');
      // No token cookie

      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });

    it('should redirect /register to dashboard if user has token', () => {
      const request = new NextRequest('http://localhost:3000/register');
      request.cookies.set('accessToken', 'fake-token');

      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/dashboard');
    });

    it('should allow /register if user has no token', () => {
      const request = new NextRequest('http://localhost:3000/register');

      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });

    it('should redirect /forgot-password to dashboard if user has token', () => {
      const request = new NextRequest('http://localhost:3000/forgot-password');
      request.cookies.set('accessToken', 'fake-token');

      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/dashboard');
    });
  });

  describe('Public Routes', () => {
    it('should allow home page to pass through', () => {
      const request = new NextRequest('http://localhost:3000/');
      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });

    it('should allow /vocabulary to pass through', () => {
      const request = new NextRequest('http://localhost:3000/vocabulary');
      const response = proxy(request);

      expect(response.headers.get('x-middleware-passed')).toBe('true');
      expect(response.status).not.toBe(307);
    });
  });

  describe('Middleware Header', () => {
    it('should set x-middleware-passed header on all non-redirected requests', () => {
      const routes = ['/dashboard', '/profile', '/', '/vocabulary', '/login'];

      routes.forEach((route) => {
        const request = new NextRequest(`http://localhost:3000${route}`);
        const response = proxy(request);

        if (response.status !== 307) {
          expect(response.headers.get('x-middleware-passed')).toBe('true');
        }
      });
    });
  });
});
