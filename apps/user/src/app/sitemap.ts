import type { MetadataRoute } from 'next';
import { siteConfig } from '../lib/site-config';
import { vocabularyData } from '../data/vocabulary';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/vocabulary',
    '/quiz',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/feedback',
    '/guides/methodology',
    '/guides/spaced-repetition',
    '/guides/vocabulary-strategy',
    '/guides/band-scores',
    '/guides/test-format',
    '/guides/academic-vs-general',
    '/guides/writing-criteria',
    '/guides/speaking-criteria',
    '/guides/listening-reading-scoring'
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route === '/vocabulary' || route === '/quiz' ? 0.9 : 0.7,
  }));

  const wordRoutes = vocabularyData.map((word) => ({
    url: `${siteConfig.url}/vocabulary/${encodeURIComponent(word.word.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...wordRoutes];
}

