import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ieltsvocabs.vercel.app';

  const routes = [
    '',
    '/vocabulary',
    '/quiz',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
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
