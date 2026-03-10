import type { MetadataRoute } from 'next';
import { siteConfig } from '../lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/vocabulary',
    '/quiz',
    '/login',
    '/register',
    '/forgot-password',
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: 'weekly' as const,
    priority:
      route === ''
        ? 1
        : route === '/vocabulary' || route === '/quiz'
        ? 0.9
        : 0.5,
  }));

  return routes;
}
